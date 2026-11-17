
ALTER TABLE public.charter_requests
ADD COLUMN requires_repositioning BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN aircraft_base TEXT NOT NULL DEFAULT 'Toluca (TLC)';
