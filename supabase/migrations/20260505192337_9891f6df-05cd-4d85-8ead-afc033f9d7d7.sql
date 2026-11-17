CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _project_url text;
  _first_name text;
BEGIN
  BEGIN
    _project_url := vault.read_secret('project_url');
  EXCEPTION WHEN OTHERS THEN
    _project_url := NULL;
  END;

  IF _project_url IS NULL OR _project_url = '' THEN
    _project_url := 'https://koyqvfvrtwzsbhaiqzju.supabase.co';
  END IF;

  _first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  PERFORM net.http_post(
    url := _project_url || '/functions/v1/send-member-welcome',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'first_name', _first_name,
      'email', NEW.email
    )
  );

  RETURN NEW;
END;
$$;