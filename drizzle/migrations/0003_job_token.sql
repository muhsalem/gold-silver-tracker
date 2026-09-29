CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;
CREATE TABLE IF NOT EXISTS private.job_tokens (name text PRIMARY KEY, token text NOT NULL);
INSERT INTO private.job_tokens (name, token)
VALUES ('jeweler_feed', encode(extensions.gen_random_bytes(32), 'hex'))
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE FUNCTION public.verify_job_token(_name text, _token text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = private AS $$
  SELECT EXISTS (SELECT 1 FROM private.job_tokens WHERE name = _name AND token = _token)
$$;
REVOKE ALL ON FUNCTION public.verify_job_token(text, text) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_job_token(text, text) TO service_role;