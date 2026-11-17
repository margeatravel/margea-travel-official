
-- Add parent-child relationship and extra fields to properties
ALTER TABLE public.properties 
  ADD COLUMN IF NOT EXISTS parent_property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS beds integer,
  ADD COLUMN IF NOT EXISTS unit_type text,
  ADD COLUMN IF NOT EXISTS special_features text[];

-- Index for fast child lookups
CREATE INDEX IF NOT EXISTS idx_properties_parent_id ON public.properties(parent_property_id) WHERE parent_property_id IS NOT NULL;
