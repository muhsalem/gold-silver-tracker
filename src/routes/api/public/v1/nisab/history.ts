import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { COUNTRIES } from "@/lib/countries";
import { GOLD_NISAB_G, SILVER_NISAB_G, TROY_OUNCE_G } from "@/lib/nisab";
import { getHistory, type HistoryRange } from "@/lib/prices.functions";
import { CORS, json } from "@/lib/public-api.server";

const RANGES = ["1mo", "6mo", "1y", "5y", "10y", "20y", "30y", "40y", "50y", "100y"] as const;
const Query = z.object({
  country: z.string().regex(/^[A-Za-z]{2}$/),
  range: z.enum(RANGES).default("1y"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export const Route = createFileRoute("/api/public/v1/nisab/history")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const sp = new URL(request.url).searchParams;
        const parsed = Query.safeParse({
          country: sp.get("country") ?? "",
          range: sp.get("range") ?? undefined,
          date: sp.get("date") ?? undefined,
        });
        if (!parsed.success) return json({ error: "use ?country=EG&range=1y|5y|10y|...|100y[&date=YYYY-MM-DD]" }, 400);
        const country = COUNTRIES.find((c) => c.code === parsed.data.country.toUpperCase());
        if (!country) return json({ error: "unknown country" }, 404);

        const h = await getHistory({ data: { range: parsed.data.range as HistoryRange, currency: country.currency } });
        let points = h.points.map((p) => ({
          date: new Date(p.t).toISOString().slice(0, 10),
          gold_nisab: (p.gold / TROY_OUNCE_G) * GOLD_NISAB_G * p.rate,
          silver_nisab: (p.silver / TROY_OUNCE_G) * SILVER_NISAB_G * p.rate,
        }));
        if (parsed.data.date) {
          const target = Date.parse(parsed.data.date);
          const nearest = points.reduce<(typeof points)[number] | null>(
            (best, p) => (!best || Math.abs(Date.parse(p.date) - target) < Math.abs(Date.parse(best.date) - target) ? p : best),
            null,
          );
          points = nearest ? [nearest] : [];
        }
        return json({
          country: country.code,
          currency: country.currency,
          range: parsed.data.range,
          approximate: Boolean(h.approx),
          fx_available: h.fxAvailable,
          sources: { metals: h.metalsSource, fx: h.ratesSource },
          points,
          disclaimer: "Indicative figures, not a fatwa. / أرقام استرشادية وليست فتوى.",
        });
      },
    },
  },
});
