-- Create transportation_requests table for paid transportation bookings
CREATE TABLE public.transportation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'paid',
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  passengers INTEGER NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT NOT NULL,
  trip_type TEXT NOT NULL DEFAULT 'one_way',
  return_date DATE,
  return_time TEXT,
  return_flight_number TEXT,
  notes TEXT,
  total_price_mxn INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transportation_requests ENABLE ROW LEVEL SECURITY;

-- Allow inserts from edge functions (service role)
CREATE POLICY "Allow service role to insert transportation requests"
ON public.transportation_requests
FOR INSERT
WITH CHECK (true);

-- Allow service role to select for verification
CREATE POLICY "Allow service role to select transportation requests"
ON public.transportation_requests
FOR SELECT
USING (true);

-- Allow service role to update status
CREATE POLICY "Allow service role to update transportation requests"
ON public.transportation_requests
FOR UPDATE
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transportation_requests_updated_at
BEFORE UPDATE ON public.transportation_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();