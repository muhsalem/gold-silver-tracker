CREATE TABLE public.jeweler_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  currency text NOT NULL,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  source text NOT NULL,
  source_url text NOT NULL,
  gold_gram numeric,
  buyback_gram numeric,
  silver_gram numeric,
  change_pct numeric,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (country, day)
);
GRANT SELECT ON public.jeweler_feed TO anon, authenticated;
GRANT ALL ON public.jeweler_feed TO service_role;
ALTER TABLE public.jeweler_feed ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jeweler feed public read" ON public.jeweler_feed FOR SELECT TO anon, authenticated USING (true);