CREATE TABLE public.nisab_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  currency text NOT NULL,
  day date NOT NULL DEFAULT ((now() AT TIME ZONE 'utc'))::date,
  gold_gram numeric,
  silver_gram numeric,
  gold_nisab numeric GENERATED ALWAYS AS (gold_gram * 85) STORED,
  silver_nisab numeric GENERATED ALWAYS AS (silver_gram * 595) STORED,
  source text NOT NULL DEFAULT ''::text,
  source_url text NOT NULL DEFAULT ''::text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (country, day)
);

GRANT SELECT ON public.nisab_history TO anon;
GRANT SELECT ON public.nisab_history TO authenticated;
GRANT ALL ON public.nisab_history TO service_role;

ALTER TABLE public.nisab_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nisab history public read"
ON public.nisab_history
FOR SELECT
TO anon, authenticated
USING (true);

CREATE INDEX nisab_history_country_day_idx ON public.nisab_history (country, day DESC);

INSERT INTO public.nisab_history (country, currency, day, gold_gram, silver_gram, source, source_url)
SELECT country, currency, day, gold_gram, silver_gram, source, source_url
FROM public.jeweler_feed
ON CONFLICT (country, day) DO NOTHING;