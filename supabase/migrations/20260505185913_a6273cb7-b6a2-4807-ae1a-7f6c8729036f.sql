CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  _project_url text;
  _first_name text;
BEGIN
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO _project_url FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;

  IF _project_url IS NULL OR _project_url = '' OR _project_url LIKE 'PLACEHOLDER%' OR _project_url LIKE 'placeholder%' THEN
    _project_url := 'https://koyqvfvrtwzsbhaiqzju.supabase.co';
  END IF;

  _first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1),
    ''
  );

  PERFORM net.http_post(
    url := _project_url || '/functions/v1/send-member-welcome',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'first_name', _first_name,
      'email', NEW.email,
      'use_fallback_sender', true
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user_welcome_email failed: %', SQLERRM;
  RETURN NEW;
END;
$function$;