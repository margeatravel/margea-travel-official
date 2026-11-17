-- Create members table for Margea Members loyalty program
CREATE TABLE public.members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  agreed_to_marketing BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a new member signup
CREATE POLICY "Anyone can join Margea Members"
ON public.members
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated users can view members
CREATE POLICY "Authenticated users can view members"
ON public.members
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);

-- Trigger for automatic updated_at
CREATE TRIGGER update_members_updated_at
BEFORE UPDATE ON public.members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index on email for fast lookups
CREATE INDEX idx_members_email ON public.members(email);