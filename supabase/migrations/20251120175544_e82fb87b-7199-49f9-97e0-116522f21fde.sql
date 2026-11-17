-- Create seasonal pricing table
CREATE TABLE public.seasonal_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  price_modifier NUMERIC NOT NULL, -- percentage multiplier (e.g., 1.10 for +10%, 0.90 for -10%)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seasonal_pricing ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view seasonal pricing"
ON public.seasonal_pricing
FOR SELECT
USING (true);

CREATE POLICY "Owners can manage seasonal pricing"
ON public.seasonal_pricing
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.properties
    WHERE properties.id = seasonal_pricing.property_id
    AND properties.owner_id = auth.uid()
  )
);

-- Add trigger for updated_at
CREATE TRIGGER update_seasonal_pricing_updated_at
BEFORE UPDATE ON public.seasonal_pricing
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_seasonal_pricing_property_dates 
ON public.seasonal_pricing(property_id, start_date, end_date);