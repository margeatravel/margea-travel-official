CREATE TABLE public.point_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_email text NOT NULL,
  member_name text,
  claim_type text NOT NULL,
  item_name text NOT NULL,
  platform text,
  booking_date date NOT NULL,
  amount_usd numeric NOT NULL,
  points integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.point_claims TO authenticated;
GRANT ALL ON public.point_claims TO service_role;

ALTER TABLE public.point_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can insert their own claims"
ON public.point_claims FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Members can view their own claims"
ON public.point_claims FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update claims"
ON public.point_claims FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_point_claims_updated_at
BEFORE UPDATE ON public.point_claims
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();