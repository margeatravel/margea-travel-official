-- Add minimum_nights column to properties table
ALTER TABLE public.properties 
ADD COLUMN minimum_nights integer NOT NULL DEFAULT 1;

-- Set Casa Bonita (Isla Mujeres) to require 3-night minimum
UPDATE public.properties 
SET minimum_nights = 3 
WHERE id = '72ea8a47-b7d0-441f-8741-37133bfbc55c';