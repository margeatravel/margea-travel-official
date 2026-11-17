-- Add user_id link and credits_balance to members
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS credits_balance INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);

-- Drop overly-broad existing select policy and replace with self-only access
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;

CREATE POLICY "Members can view their own record"
ON public.members
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR (user_id IS NULL AND auth.email() = email)
);

CREATE POLICY "Members can update their own record"
ON public.members
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id
  OR (user_id IS NULL AND auth.email() = email)
)
WITH CHECK (
  auth.uid() = user_id
  OR (user_id IS NULL AND auth.email() = email)
);

-- Trigger: when a new auth user is created, link any matching members row
CREATE OR REPLACE FUNCTION public.link_member_to_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.members
  SET user_id = NEW.id
  WHERE email = NEW.email
    AND user_id IS NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_link_member ON auth.users;
CREATE TRIGGER on_auth_user_created_link_member
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.link_member_to_auth_user();