ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS cleaning_fee numeric NOT NULL DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS cleaning_fee numeric NOT NULL DEFAULT 0;