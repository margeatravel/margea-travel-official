-- Create table for custom package requests
CREATE TABLE IF NOT EXISTS public.custom_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_number TEXT NOT NULL UNIQUE DEFAULT 'MAR-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  budget INTEGER NOT NULL,
  interests JSONB NOT NULL DEFAULT '{}',
  check_in DATE,
  check_out DATE,
  guests INTEGER NOT NULL DEFAULT 2,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for yacht booking requests
CREATE TABLE IF NOT EXISTS public.yacht_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_number TEXT NOT NULL UNIQUE DEFAULT 'MAR-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
  yacht_name TEXT NOT NULL,
  yacht_size TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  requested_date DATE,
  guests INTEGER,
  duration TEXT,
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.custom_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yacht_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for custom_packages
CREATE POLICY "Anyone can create custom package requests"
  ON public.custom_packages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own requests via email"
  ON public.custom_packages
  FOR SELECT
  USING (true);

-- Create policies for yacht_bookings
CREATE POLICY "Anyone can create yacht booking requests"
  ON public.yacht_bookings
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view yacht bookings"
  ON public.yacht_bookings
  FOR SELECT
  USING (true);

-- Create trigger for updating updated_at on custom_packages
CREATE TRIGGER update_custom_packages_updated_at
  BEFORE UPDATE ON public.custom_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating updated_at on yacht_bookings
CREATE TRIGGER update_yacht_bookings_updated_at
  BEFORE UPDATE ON public.yacht_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();