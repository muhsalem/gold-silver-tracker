-- Roles ---------------------------------------------------------------
CREATE TYPE public.app_role AS ENUM ('admin', 'jeweler', 'ambassador', 'volunteer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  org text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'EG',
  city text NOT NULL DEFAULT '',
  contact text NOT NULL DEFAULT '',
  license text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles insert own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "roles read own" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- New users get a profile and the volunteer role -----------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, contact)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)), COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'volunteer') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Price submissions ----------------------------------------------------
CREATE TABLE public.price_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country text NOT NULL,
  city text NOT NULL DEFAULT '',
  currency text NOT NULL,
  metal text NOT NULL DEFAULT 'gold',
  gold_gram numeric,
  silver_gram numeric,
  buyback_gram numeric,
  source text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  auto_approved boolean NOT NULL DEFAULT false,
  reviewed_by uuid,
  review_reason text NOT NULL DEFAULT '',
  reviewed_at timestamptz,
  quality integer,
  ai_summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX price_submissions_country_idx ON public.price_submissions (country, created_at DESC);
GRANT SELECT ON public.price_submissions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.price_submissions TO authenticated;
GRANT ALL ON public.price_submissions TO service_role;
ALTER TABLE public.price_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approved prices public" ON public.price_submissions FOR SELECT USING (status = 'approved');
CREATE POLICY "own or admin read" ON public.price_submissions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "insert own price" ON public.price_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins review prices" ON public.price_submissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Votes ----------------------------------------------------------------
CREATE TABLE public.price_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.price_submissions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote smallint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (submission_id, user_id)
);
GRANT SELECT ON public.price_votes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_votes TO authenticated;
GRANT ALL ON public.price_votes TO service_role;
ALTER TABLE public.price_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "votes readable" ON public.price_votes FOR SELECT USING (true);
CREATE POLICY "vote own" ON public.price_votes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own vote" ON public.price_votes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "delete own vote" ON public.price_votes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Audit log ------------------------------------------------------------
CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id uuid,
  reason text NOT NULL DEFAULT '',
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read audit" ON public.audit_log FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "authenticated write audit" ON public.audit_log FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id);

-- Notification preferences and inbox -----------------------------------
CREATE TABLE public.notification_prefs (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  countries text[] NOT NULL DEFAULT '{}',
  metals text[] NOT NULL DEFAULT ARRAY['gold','silver'],
  in_app boolean NOT NULL DEFAULT true,
  email boolean NOT NULL DEFAULT false,
  daily_digest boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notification_prefs TO authenticated;
GRANT ALL ON public.notification_prefs TO service_role;
ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prefs own" ON public.notification_prefs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notifications mark read" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Trusted contributors get automatic approval --------------------------
CREATE OR REPLACE FUNCTION public.is_trusted(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT (
    SELECT count(*) FROM public.price_submissions
    WHERE user_id = _user_id AND status = 'approved'
  ) >= 5
  AND (
    SELECT count(*) FROM public.price_submissions s
    WHERE s.user_id = _user_id AND s.status = 'rejected'
      AND s.created_at > now() - interval '180 days'
  ) = 0
$$;

CREATE OR REPLACE FUNCTION public.auto_approve_submission()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'pending' AND public.is_trusted(NEW.user_id) THEN
    NEW.status := 'approved';
    NEW.auto_approved := true;
    NEW.reviewed_at := now();
    NEW.review_reason := 'auto: trusted contributor';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER price_submissions_auto_approve BEFORE INSERT ON public.price_submissions
  FOR EACH ROW EXECUTE FUNCTION public.auto_approve_submission();

-- Fan out notifications when a price becomes approved ------------------
CREATE OR REPLACE FUNCTION public.notify_price_approved()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    INSERT INTO public.notifications (user_id, kind, title, body, country)
    SELECT p.user_id, 'price_approved',
           'سعر محلي جديد معتمد',
           concat('تم اعتماد سعر جديد في ', NEW.country, ' بعملة ', NEW.currency),
           NEW.country
    FROM public.notification_prefs p
    WHERE p.in_app AND (NEW.country = ANY (p.countries)) AND p.user_id <> NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER price_submissions_notify AFTER INSERT OR UPDATE ON public.price_submissions
  FOR EACH ROW EXECUTE FUNCTION public.notify_price_approved();

-- Leaderboard ----------------------------------------------------------
CREATE OR REPLACE FUNCTION public.jeweler_leaderboard(_country text DEFAULT NULL)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  org text,
  country text,
  approved bigint,
  up_votes bigint,
  down_votes bigint,
  accuracy numeric,
  points numeric
) LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT pr.id,
         pr.display_name,
         pr.org,
         pr.country,
         count(DISTINCT s.id) AS approved,
         coalesce(sum(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END), 0) AS up_votes,
         coalesce(sum(CASE WHEN v.vote = -1 THEN 1 ELSE 0 END), 0) AS down_votes,
         CASE WHEN count(v.id) = 0 THEN NULL
              ELSE round(100.0 * sum(CASE WHEN v.vote = 1 THEN 1 ELSE 0 END) / count(v.id), 0)
         END AS accuracy,
         count(DISTINCT s.id) * 10
           + coalesce(sum(CASE WHEN v.vote = 1 THEN 2 ELSE -1 END), 0) AS points
  FROM public.profiles pr
  JOIN public.price_submissions s ON s.user_id = pr.id AND s.status = 'approved'
  LEFT JOIN public.price_votes v ON v.submission_id = s.id
  WHERE _country IS NULL OR s.country = _country
  GROUP BY pr.id, pr.display_name, pr.org, pr.country
  ORDER BY points DESC
  LIMIT 20
$$;
GRANT EXECUTE ON FUNCTION public.jeweler_leaderboard(text) TO anon, authenticated;