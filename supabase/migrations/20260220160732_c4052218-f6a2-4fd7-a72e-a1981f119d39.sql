
-- Golf bookings table for Stripe-based tee time reservations
CREATE TABLE public.golf_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_number TEXT NOT NULL DEFAULT ('MAR-GF-' || lpad(floor(random() * 100000)::text, 5, '0')),
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL,
  player_name TEXT NOT NULL,
  player_email TEXT NOT NULL,
  player_phone TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  number_of_players INTEGER NOT NULL DEFAULT 1,
  rate_type TEXT NOT NULL DEFAULT 'prime',
  price_per_player INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  notes TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.golf_bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can insert golf bookings" ON public.golf_bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view golf bookings" ON public.golf_bookings
  FOR SELECT USING (true);

CREATE POLICY "Service role can update golf bookings" ON public.golf_bookings
  FOR UPDATE USING (true);
