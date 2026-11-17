-- Create concierge_requests table for service bookings
CREATE TABLE public.concierge_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT NOT NULL DEFAULT ('MAR-CS-' || lpad((floor((random() * (100000)::double precision)))::text, 5, '0')),
  service_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  preferred_date DATE,
  guests INTEGER,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.concierge_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit concierge requests
CREATE POLICY "Anyone can submit concierge requests"
ON public.concierge_requests
FOR INSERT
WITH CHECK (true);

-- Allow viewing for authenticated users
CREATE POLICY "Authenticated users can view concierge requests"
ON public.concierge_requests
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_concierge_requests_updated_at
BEFORE UPDATE ON public.concierge_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();