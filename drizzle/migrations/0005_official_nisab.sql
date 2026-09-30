CREATE TABLE public.official_nisab (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  currency text not null,
  gold_nisab numeric,
  silver_nisab numeric,
  authority text not null,
  source_url text not null default '',
  announced_on date not null default ((now() AT TIME ZONE 'utc')::date),
  created_by uuid,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.official_nisab TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.official_nisab TO authenticated;
GRANT ALL ON public.official_nisab TO service_role;
ALTER TABLE public.official_nisab ENABLE ROW LEVEL SECURITY;
CREATE POLICY "official nisab public read" ON public.official_nisab FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage official nisab" ON public.official_nisab FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX official_nisab_country_idx ON public.official_nisab (country, announced_on desc);