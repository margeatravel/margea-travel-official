DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sandbox_exec') THEN
    GRANT SELECT, INSERT, UPDATE, DELETE ON public.external_bookings TO sandbox_exec;
    GRANT SELECT, UPDATE ON public.properties TO sandbox_exec;
  END IF;
END
$$;