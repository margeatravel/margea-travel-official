
-- Add min_nights column to seasonal_pricing for per-season minimum stay requirements
ALTER TABLE public.seasonal_pricing
ADD COLUMN min_nights integer DEFAULT NULL;
