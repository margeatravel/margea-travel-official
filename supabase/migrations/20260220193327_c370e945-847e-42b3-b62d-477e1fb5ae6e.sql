
-- Charter quote requests table
CREATE TABLE public.charter_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT NOT NULL DEFAULT ('MAR-CH-' || lpad(floor(random() * 100000)::text, 5, '0')),
  aircraft TEXT NOT NULL DEFAULT 'Learjet 31A',
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers INTEGER NOT NULL DEFAULT 1,
  flight_type TEXT NOT NULL DEFAULT 'one_way',
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.charter_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit charter requests"
  ON public.charter_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view charter requests"
  ON public.charter_requests FOR SELECT
  USING (true);

CREATE TRIGGER update_charter_requests_updated_at
  BEFORE UPDATE ON public.charter_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
