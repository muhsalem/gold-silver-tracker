CREATE OR REPLACE FUNCTION public.notify_price_quality_changed()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'approved' AND NEW.quality IS DISTINCT FROM OLD.quality THEN
    INSERT INTO public.notifications (user_id, kind, title, body, country)
    SELECT p.user_id, 'quality_changed',
           'تغيّر تقييم جودة سعر محلي',
           concat('تقييم سعر ', NEW.country, ' أصبح ', coalesce(NEW.quality::text, '—')),
           NEW.country
    FROM public.notification_prefs p
    WHERE p.in_app AND (NEW.country = ANY (p.countries)) AND p.user_id <> NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER price_submissions_quality_notify AFTER UPDATE ON public.price_submissions
  FOR EACH ROW EXECUTE FUNCTION public.notify_price_quality_changed();