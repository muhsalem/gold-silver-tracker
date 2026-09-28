import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

/** A local jeweller quote is considered current for 72 hours after approval. */
export const LOCAL_QUOTE_MAX_AGE_MS = 72 * 60 * 60 * 1000;

export type LocalQuote = {
  goldGram: number | null;
  silverGram: number | null;
  buybackGram: number | null;
  city: string;
  source: string;
  at: string;
  count: number;
};

function median(values: number[]): number | null {
  if (!values.length) return null;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2;
}

/**
 * Approved local jeweller quotes for a country (median of the last 72h),
 * or null when no current local quote exists.
 */
export function useLocalQuote(country: string, currency: string) {
  return useQuery<LocalQuote | null>({
    queryKey: ["local-quote", country, currency],
    enabled: Boolean(country && currency),
    staleTime: 15 * 60 * 1000,
    queryFn: async () => {
      const since = new Date(Date.now() - LOCAL_QUOTE_MAX_AGE_MS).toISOString();
      const { data, error } = await supabase
        .from("price_submissions")
        .select("gold_gram, silver_gram, buyback_gram, city, source, reviewed_at, created_at")
        .eq("status", "approved")
        .eq("country", country)
        .eq("currency", currency)
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error || !data?.length) return null;
      const nums = (k: "gold_gram" | "silver_gram" | "buyback_gram") =>
        data.map((r) => r[k]).filter((v): v is number => typeof v === "number" && v > 0);
      const latest = data[0]!;
      return {
        goldGram: median(nums("gold_gram")),
        silverGram: median(nums("silver_gram")),
        buybackGram: median(nums("buyback_gram")),
        city: latest.city,
        source: latest.source,
        at: latest.reviewed_at ?? latest.created_at,
        count: data.length,
      };
    },
  });
}
