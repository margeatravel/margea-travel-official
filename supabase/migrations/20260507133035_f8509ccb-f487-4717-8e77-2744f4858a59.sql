
-- Activate member record
UPDATE public.members
SET status = 'active', updated_at = now()
WHERE lower(email) = 'valemaloj@gmail.com';

-- Insert admin role for the auth user if exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE lower(email) = 'valemaloj@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
