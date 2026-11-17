-- Create table for property listing requests
CREATE TABLE public.property_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  property_title TEXT NOT NULL,
  property_description TEXT NOT NULL,
  location TEXT NOT NULL,
  property_type TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  price_per_night NUMERIC NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable RLS
ALTER TABLE public.property_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit a property request
CREATE POLICY "Anyone can submit property requests"
ON public.property_requests
FOR INSERT
WITH CHECK (true);

-- Only allow reading for authenticated users (admin use only via Lovable backend)
CREATE POLICY "Only authenticated users can view requests"
ON public.property_requests
FOR SELECT
USING (auth.uid() IS NOT NULL);