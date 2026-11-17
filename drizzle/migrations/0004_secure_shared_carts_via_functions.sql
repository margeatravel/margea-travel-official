-- Shared carts are now only reachable through narrow functions (create, read one by id, mark used)
CREATE OR REPLACE FUNCTION public.create_shared_cart(_cart_json jsonb, _total_usd numeric)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id uuid;
BEGIN
  IF _cart_json IS NULL OR jsonb_typeof(_cart_json) <> 'array'
     OR jsonb_array_length(_cart_json) = 0 OR jsonb_array_length(_cart_json) > 50
     OR pg_column_size(_cart_json) > 100000 THEN
    RAISE EXCEPTION 'Invalid cart';
  END IF;
  IF _total_usd IS NULL OR _total_usd < 0 OR _total_usd > 1000000 THEN
    RAISE EXCEPTION 'Invalid total';
  END IF;

  INSERT INTO public.shared_carts (cart_json, total_usd)
  VALUES (_cart_json, _total_usd)
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_shared_cart(_id uuid)
RETURNS TABLE(cart_json jsonb, used_at timestamptz, expires_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.cart_json, s.used_at, s.expires_at
  FROM public.shared_carts s
  WHERE s.id = _id
$$;

CREATE OR REPLACE FUNCTION public.mark_shared_cart_used(_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.shared_carts
  SET used_at = now()
  WHERE id = _id AND used_at IS NULL AND expires_at > now();
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.create_shared_cart(jsonb, numeric) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_shared_cart(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.mark_shared_cart_used(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_shared_cart(jsonb, numeric) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_shared_cart(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mark_shared_cart_used(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can create a shared cart" ON public.shared_carts;
DROP POLICY IF EXISTS "Anyone with the link can view a shared cart" ON public.shared_carts;
DROP POLICY IF EXISTS "Anyone can mark an unused shared cart as used" ON public.shared_carts;

REVOKE ALL ON public.shared_carts FROM anon, authenticated;
GRANT ALL ON public.shared_carts TO service_role;
ALTER TABLE public.shared_carts ENABLE ROW LEVEL SECURITY;