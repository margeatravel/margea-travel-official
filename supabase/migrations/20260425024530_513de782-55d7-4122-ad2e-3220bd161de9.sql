-- Function to grant admin role by email (callable only by existing admins)
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _target_user_id uuid;
  _normalized_email text;
BEGIN
  -- Only existing admins may call this
  IF NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can grant admin access';
  END IF;

  _normalized_email := lower(trim(_email));

  IF _normalized_email IS NULL OR _normalized_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  -- Find the auth user by email
  SELECT id INTO _target_user_id
  FROM auth.users
  WHERE lower(email) = _normalized_email
  LIMIT 1;

  IF _target_user_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'No user account found for that email. The person must sign up first.'
    );
  END IF;

  -- Insert the admin role (idempotent)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_target_user_id, 'admin'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin role granted',
    'user_id', _target_user_id
  );
END;
$$;

-- Ensure uniqueness for the ON CONFLICT above
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_role_unique
  ON public.user_roles (user_id, role);

-- Allow authenticated users to call (function itself enforces admin check)
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text) TO authenticated;