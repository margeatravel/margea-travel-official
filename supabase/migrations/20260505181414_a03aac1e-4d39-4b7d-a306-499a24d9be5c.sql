DO $$
DECLARE
  _existing_id uuid;
BEGIN
  SELECT id INTO _existing_id FROM vault.secrets WHERE name = 'service_role_key' LIMIT 1;
  IF _existing_id IS NULL THEN
    -- Placeholder; user will update via vault UI if needed. Trigger handles missing key gracefully.
    PERFORM vault.create_secret('REPLACE_WITH_SERVICE_ROLE_KEY', 'service_role_key');
  END IF;
END $$;