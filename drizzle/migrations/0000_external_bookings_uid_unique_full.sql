DROP INDEX IF EXISTS public.external_bookings_uid_unique;
CREATE UNIQUE INDEX IF NOT EXISTS external_bookings_uid_unique
  ON public.external_bookings (property_id, source_url, external_id);