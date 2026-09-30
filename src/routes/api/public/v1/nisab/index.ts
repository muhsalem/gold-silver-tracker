import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { COUNTRIES } from "@/lib/countries";
import { GOLD_NISAB_G, SILVER_NISAB_G, goldNisabValue, perGram, silverNisabValue } from "@/lib/nisab";
import { getLivePrices } from "@/lib/prices.functions";
import { CORS, json, publicDb } from "@/lib/public-api.server";

const Query = z.object({ country: z.string().regex(/^[A-Za-z]{2}$/) });

export const Route = createFileRoute("/api/public/v1/nisab/")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const parsed = Query.safeParse({ country: url.searchParams.get("country") ?? "" });
        if (!parsed.success) return json({ error: "country must be an ISO-3166 alpha-2 code, e.g. ?country=EG" }, 400);
        const country = COUNTRIES.find((c) => c.code === parsed.data.country.toUpperCase());
        if (!country) return json({ error: "unknown country" }, 404);

        const prices = await getLivePrices();
        const rate = prices.rates[country.currency];
        const db = publicDb();
        const [official, feed] = await Promise.all([
          db.from("official_nisab").select("gold_nisab,silver_nisab,currency,authority,source_url,announced_on")
            .eq("country", country.code).order("announced_on", { ascending: false }).limit(1).maybeSingle(),
          db.from("jeweler_feed").select("gold_gram,buyback_gram,silver_gram,currency,source,source_url,day")
            .eq("country", country.code).order("day", { ascending: false }).limit(1).maybeSingle(),
        ]);

        return json({
          country: country.code,
          name: { ar: country.ar, en: country.en },
          currency: country.currency,
          weights: { gold_g: GOLD_NISAB_G, gold_karat: 24, silver_g: SILVER_NISAB_G },
          market: rate
            ? {
                gold_gram: perGram(prices.goldUsdOz, rate),
                silver_gram: perGram(prices.silverUsdOz, rate),
                gold_nisab: goldNisabValue(prices.goldUsdOz, rate),
                silver_nisab: silverNisabValue(prices.silverUsdOz, rate),
                metals_source: prices.metals.source,
                fx_source: prices.fx.source,
                quality: prices.metals.quality,
                updated_at: prices.metalsUpdatedAt,
              }
            : null,
          local_jewelers: feed.data ?? null,
          official: official.data ?? null,
          disclaimer: "Indicative figures, not a fatwa. / أرقام استرشادية وليست فتوى.",
          attribution: "Nisab · https://nissab-rates.lovable.app",
        });
      },
    },
  },
});
