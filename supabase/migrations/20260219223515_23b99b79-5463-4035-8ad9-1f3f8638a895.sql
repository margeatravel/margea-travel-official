
-- Create golf_inquiries table
CREATE TABLE public.golf_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_course TEXT NOT NULL,
  preferred_tee_time TEXT,
  number_of_players INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  case_number TEXT NOT NULL DEFAULT ('MAR-GF-' || lpad((floor(random() * 100000))::text, 5, '0')),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.golf_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit golf inquiries
CREATE POLICY "Anyone can submit golf inquiries"
ON public.golf_inquiries
FOR INSERT
WITH CHECK (true);

-- Anyone can view golf inquiries (for confirmation)
CREATE POLICY "Anyone can view golf inquiries"
ON public.golf_inquiries
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_golf_inquiries_updated_at
BEFORE UPDATE ON public.golf_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
