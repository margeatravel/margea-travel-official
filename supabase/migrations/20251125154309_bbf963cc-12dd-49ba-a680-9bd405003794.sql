-- Create table for tour bookings
CREATE TABLE IF NOT EXISTS public.tour_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_name TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  requested_date DATE,
  guests INTEGER,
  special_requests TEXT,
  confirmation_number TEXT NOT NULL DEFAULT ('MAR-' || lpad((floor((random() * 100000)))::text, 5, '0')),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tour_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can create tour booking requests"
ON public.tour_bookings
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view tour bookings"
ON public.tour_bookings
FOR SELECT
USING (true);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_tour_bookings_updated_at
BEFORE UPDATE ON public.tour_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();