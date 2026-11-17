-- Trigger: invoke send-member-welcome edge function on new auth.users INSERT
-- Replaces frontend invocation so every new user (signup form, dashboard, OAuth, admin) gets a welcome email.

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Store service role key in vault (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM vault.secrets WHERE name = 'project_url') THEN
    PERFORM vault.create_secret('https://koyqvfvrtwzsbhaiqzju.supabase.co', 'project_url');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.handle_new_user_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  _project_url text;
  _service_key text;
  _first_name text;
BEGIN
  -- Skip if no email (anonymous users etc.)
  IF NEW.email IS NULL OR NEW.email = '' THEN
    RETURN NEW;
  END IF;

  SELECT decrypted_secret INTO _project_url FROM vault.decrypted_secrets WHERE name = 'project_url' LIMIT 1;
  SELECT decrypted_secret INTO _service_key FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1;

  IF _project_url IS NULL OR _service_key IS NULL THEN
    RAISE WARNING 'handle_new_user_welcome_email: missing vault secrets project_url or service_role_key';
    RETURN NEW;
  END IF;

  _first_name := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 1),
    ''
  );

  PERFORM net.http_post(
    url := _project_url || '/functions/v1/send-member-welcome',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || _service_key
    ),
    body := jsonb_build_object(
      'first_name', _first_name,
      'email', NEW.email
    )
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block user creation if email send fails
  RAISE WARNING 'handle_new_user_welcome_email failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_send_welcome ON auth.users;
CREATE TRIGGER on_auth_user_created_send_welcome
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_welcome_email();