import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type AssessInput = {
  country: string;
  currency: string;
  metal: "gold" | "silver";
  localGram: number;
  globalGram: number | null;
  /** Optional local history the user typed: "YYYY-MM-DD=price" pairs. */
  history: { date: string; price: number }[];
  lang: string;
};

function parse(input: unknown): AssessInput {
  const v = input as Partial<AssessInput>;
  if (!v || typeof v.localGram !== "number" || !(v.localGram > 0)) {
    throw new Error("invalid price");
  }
  return {
    country: String(v.country ?? ""),
    currency: String(v.currency ?? ""),
    metal: v.metal === "silver" ? "silver" : "gold",
    localGram: v.localGram,
    globalGram: typeof v.globalGram === "number" ? v.globalGram : null,
    history: Array.isArray(v.history) ? v.history.slice(0, 60) : [],
    lang: String(v.lang ?? "ar"),
  };
}

/**
 * Explained plausibility review of a locally quoted gram price.
 * Reasoning model on the gateway Responses API; the stream is consumed here.
 */
export const assessLocalPrice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(parse)
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("missing LOVABLE_API_KEY");

    const { createOpenAI } = await import("@ai-sdk/openai");
    const { streamText } = await import("ai");
    const { createLovableAiGatewayRunIdFetch } = await import("./ai-gateway.server");

    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: key,
      headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const series = data.history
      .map((p) => `${p.date}: ${p.price}`)
      .join("\n");

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system:
        "أنت محلل أسواق معادن. تكتب تقييمًا موجزًا ومفسّرًا لمعقولية سعر محلي لجرام معدن ثمين. " +
        "لا تُفتِ شرعًا، ولا تقدّم نصيحة استثمارية، ولا تخترع بيانات. " +
        `اكتب بلغة الرمز: ${data.lang}. ` +
        "اجعل الإجابة أربعة أقسام قصيرة بعناوين: الحكم على المعقولية، العوامل المؤثرة، السيناريوهات المحتملة، تنبيهات. " +
        "الطول أقل من 250 كلمة، بدون جداول.",
      prompt:
        `الدولة: ${data.country}\nالعملة: ${data.currency}\nالمعدن: ${data.metal === "gold" ? "ذهب عيار 24" : "فضة نقية"}\n` +
        `سعر الجرام المحلي المُدخل: ${data.localGram} ${data.currency}\n` +
        `السعر العالمي المجرَّد للجرام (تقديري): ${data.globalGram ?? "غير متاح"} ${data.currency}\n` +
        (series ? `سلسلة أسعار محلية أدخلها المستخدم:\n${series}\n` : "لا توجد سلسلة تاريخية مُدخلة.\n") +
        "قيّم هل السعر المحلي معقول مقارنة بالسعر العالمي وبالسلسلة، واذكر نسبة الفارق إن أمكن.",
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const text = await result.text;
    return { text: text.trim() };
  });
