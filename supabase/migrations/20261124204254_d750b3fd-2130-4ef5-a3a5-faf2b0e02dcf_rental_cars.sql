-- ============================================================
-- YAAB car rentals (Margea Travel "Renta de Coches")
-- Tables: rental_cars (public catalogue) + car_bookings
-- (reservations; deposit-only via Stripe, balance on delivery)
-- RPC: get_car_blocked_dates (public calendar availability)
-- ============================================================

-- ---------- rental_cars ----------
CREATE TABLE public.rental_cars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  trim text,
  brand text NOT NULL,
  year integer NOT NULL,
  passengers integer NOT NULL,
  transmission text NOT NULL DEFAULT 'Automática',
  doors integer NOT NULL DEFAULT 5,
  air_conditioning boolean NOT NULL DEFAULT true,
  price_per_day_mxn numeric NOT NULL,
  deposit_mxn numeric,
  min_days integer NOT NULL DEFAULT 3,
  units_available integer NOT NULL DEFAULT 1,
  image_url text NOT NULL,
  gallery_urls text[] NOT NULL DEFAULT '{}',
  description_es text,
  description_en text,
  features text[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.rental_cars ENABLE ROW LEVEL SECURITY;

-- Public catalogue: anyone can read active cars (anon + authenticated)
CREATE POLICY "Anyone can view active rental cars"
ON public.rental_cars FOR SELECT TO anon, authenticated
USING (active = true);

CREATE POLICY "Admins can manage rental cars"
ON public.rental_cars FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_rental_cars_updated_at
BEFORE UPDATE ON public.rental_cars
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- car_bookings ----------
CREATE TABLE public.car_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id uuid NOT NULL REFERENCES public.rental_cars (id) ON DELETE RESTRICT,
  confirmation_number text NOT NULL UNIQUE,
  driver_name text NOT NULL,
  driver_email text NOT NULL,
  driver_phone text,
  pickup_date date NOT NULL,
  return_date date NOT NULL,
  pickup_time time,
  return_time time,
  pickup_location text,
  return_location text,
  total_days integer NOT NULL CHECK (total_days >= 3),
  price_per_day_mxn numeric NOT NULL,
  total_mxn numeric NOT NULL,
  deposit_paid_mxn numeric NOT NULL,
  balance_due_mxn numeric NOT NULL,
  security_deposit_mxn numeric,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  payment_status text NOT NULL DEFAULT 'deposit_paid'
    CHECK (payment_status IN ('deposit_paid', 'paid_in_full', 'refunded')),
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  additional_driver boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_car_bookings_car_id ON public.car_bookings (car_id);
CREATE INDEX idx_car_bookings_dates ON public.car_bookings (car_id, pickup_date, return_date);
CREATE INDEX idx_car_bookings_session ON public.car_bookings (stripe_session_id);

ALTER TABLE public.car_bookings ENABLE ROW LEVEL SECURITY;

-- Bookings contain PII: no public access. Service role (edge functions)
-- bypasses RLS; admins can view/update (e.g. confirm with YAAB, cancel).
CREATE POLICY "Admins can view car bookings"
ON public.car_bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update car bookings"
ON public.car_bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_car_bookings_updated_at
BEFORE UPDATE ON public.car_bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- RPC: blocked dates for the public calendar ----------
-- Mirror of public.get_property_blocked_dates(): exposes only dates,
-- no PII. Pending + confirmed bookings block the calendar; availability
-- itself is confirmed with YAAB after the deposit is paid.
CREATE OR REPLACE FUNCTION public.get_car_blocked_dates(p_car_id uuid)
RETURNS TABLE (pickup_date date, return_date date)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pickup_date, return_date
  FROM public.car_bookings
  WHERE car_id = p_car_id
    AND status IN ('pending', 'confirmed');
$$;

GRANT EXECUTE ON FUNCTION public.get_car_blocked_dates(uuid) TO anon, authenticated;

-- ---------- Seed: YAAB fleet (prices "Desde" from yaabcar.mx, 24 Nov 2026) ----------
-- Total = days x price_per_day, no duration discount announced.
-- Deposit (security, NOT charged online): only JAC $5,000 confirmed.
INSERT INTO public.rental_cars
  (slug, name, trim, brand, year, passengers, transmission, doors, air_conditioning,
   price_per_day_mxn, deposit_mxn, min_days, units_available, image_url,
   description_es, description_en, features, sort_order)
VALUES
  ('jac-sei-8', 'JAC SEI 8', 'Limited', 'JAC', 2025, 7, 'Automática', 5, true,
   1850, 5000, 3, 1, '/yaab-cars/jac_sei_8_2025_roja.png',
   'SUV familiar de 7 pasajeros, amplia y equipada para viajes en grupo por Cancún y la Riviera Maya.',
   'Roomy 7-passenger family SUV, ideal for group trips around Cancún and the Riviera Maya.',
   ARRAY['Seguro incluido', 'Kilometraje libre', 'Entrega 24h en Cancún', 'A/C'], 1),
  ('suzuki-ertiga', 'Suzuki Ertiga', 'Boostergreen', 'Suzuki', 2025, 7, 'Automática', 5, true,
   1500, NULL, 3, 1, '/yaab-cars/susuki_ertiga_2026_beige.png',
   'Minivan familiar de 7 pasajeros, cómoda y práctica para familias y grupos.',
   'Comfortable 7-passenger family minivan, practical for families and groups.',
   ARRAY['Seguro incluido', 'Kilometraje libre', 'Entrega 24h en Cancún', 'A/C'], 2),
  ('dodge-attitude', 'Dodge Attitude', 'SE', 'Dodge', 2022, 5, 'Automática', 5, true,
   650, NULL, 3, 1, '/yaab-cars/dodge_attitude_2022_plata.png',
   'Sedán económico y automático, práctico para recorrer la ciudad.',
   'Economical automatic sedan, practical for getting around the city.',
   ARRAY['Seguro incluido', 'Kilometraje libre', 'Entrega 24h en Cancún', 'A/C'], 3);
