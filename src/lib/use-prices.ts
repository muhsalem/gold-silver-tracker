import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";

import { getLivePrices, type LivePrices } from "./prices.functions";
import { readOverrides, type Overrides } from "./overrides";

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Live prices merged with any manual overrides saved on this device. */
export function usePrices() {
  const fetchPrices = useServerFn(getLivePrices);
  const query = useQuery<LivePrices>({
    queryKey: ["live-prices"],
    queryFn: () => fetchPrices({}),
    staleTime: 60 * 60 * 1000,
    refetchInterval: DAY_MS,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const [overrides, setOverrides] = useState<Overrides>({});
  useEffect(() => {
    const sync = () => setOverrides(readOverrides());
    sync();
    window.addEventListener("nisab-overrides", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nisab-overrides", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const data = useMemo(() => {
    if (!query.data) return undefined;
    const manual =
      overrides.goldUsdOz != null ||
      overrides.silverUsdOz != null ||
      (overrides.rates && Object.keys(overrides.rates).length > 0);
    return {
      ...query.data,
      goldUsdOz: overrides.goldUsdOz ?? query.data.goldUsdOz,
      silverUsdOz: overrides.silverUsdOz ?? query.data.silverUsdOz,
      rates: { ...query.data.rates, ...(overrides.rates ?? {}) },
      manual: Boolean(manual),
      manualUpdatedAt: overrides.updatedAt,
    };
  }, [query.data, overrides]);

  return { ...query, data, overrides };
}

export function useRate(currency: string, rates?: Record<string, number>) {
  return rates?.[currency] ?? (currency === "USD" ? 1 : undefined);
}
