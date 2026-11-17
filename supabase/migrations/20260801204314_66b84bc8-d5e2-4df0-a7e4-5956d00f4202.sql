CREATE TABLE public.shared_carts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_json jsonb NOT NULL,
  total_usd numeric NOT NULL DEFAULT 0,
  sharer_note text,
  used_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.shared_carts TO anon;
GRANT SELECT, INSERT, UPDATE ON public.shared_carts TO authenticated;
GRANT ALL ON public.shared_carts TO service_role;

ALTER TABLE public.shared_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone with the link can view a shared cart"
ON public.shared_carts FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can create a shared cart"
ON public.shared_carts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can mark an unused shared cart as used"
ON public.shared_carts FOR UPDATE
TO anon, authenticated
USING (used_at IS NULL AND expires_at > now())
WITH CHECK (true);

CREATE TRIGGER update_shared_carts_updated_at
BEFORE UPDATE ON public.shared_carts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();