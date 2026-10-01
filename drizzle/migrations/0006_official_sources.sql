CREATE TABLE public.official_sources (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  currency text not null,
  authority text not null,
  url text not null,
  value_pattern text,
  metal text not null default 'gold',
  active boolean not null default true,
  last_hash text,
  last_snippet text not null default '',
  last_value numeric,
  last_checked timestamptz,
  last_changed timestamptz,
  last_error text not null default '',
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.official_sources TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.official_sources TO authenticated;
GRANT ALL ON public.official_sources TO service_role;
ALTER TABLE public.official_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "official sources public read" ON public.official_sources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage official sources" ON public.official_sources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.official_sources (country, currency, authority, url, value_pattern, metal) VALUES
 ('MY','MYR','Pusat Pungutan Zakat (PPZ-MAIWP)','https://www.zakat.com.my/','Nisab\s*\d{4}\s*:?\s*RM\s*([\d,]+(?:\.\d+)?)','gold'),
 ('KW','KWD','بيت الزكاة الكويتي','https://www.zakathouse.org.kw/',NULL,'gold'),
 ('EG','EGP','دار الإفتاء المصرية','https://www.dar-alifta.org/ar/',NULL,'gold');

CREATE OR REPLACE FUNCTION public.notify_official_nisab()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, kind, title, body, country)
  SELECT DISTINCT u, 'official_nisab', 'إعلان نصاب رسمي جديد',
         concat(NEW.authority, ' أعلنت نصاب ', NEW.country, ': ',
                coalesce('ذهب ' || NEW.gold_nisab::text || ' ', ''),
                coalesce('فضة ' || NEW.silver_nisab::text || ' ', ''), NEW.currency),
         NEW.country
  FROM (
    SELECT p.user_id AS u FROM public.notification_prefs p WHERE p.in_app AND NEW.country = ANY (p.countries)
    UNION SELECT r.user_id FROM public.user_roles r WHERE r.role = 'admin'
  ) t;
  RETURN NEW;
END;
$$;
CREATE TRIGGER official_nisab_notify AFTER INSERT ON public.official_nisab
  FOR EACH ROW EXECUTE FUNCTION public.notify_official_nisab();