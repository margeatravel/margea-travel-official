-- Add external iCal URLs field to properties table
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS external_ical_urls text[] DEFAULT '{}';

-- Create table to store external bookings from iCal imports
CREATE TABLE IF NOT EXISTS external_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  source_name text NOT NULL, -- e.g., 'Airbnb', 'VRBO', 'Booking.com'
  source_url text NOT NULL, -- The iCal feed URL
  external_id text, -- Booking ID from external source if available
  check_in date NOT NULL,
  check_out date NOT NULL,
  summary text, -- Event summary from iCal
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(property_id, source_url, check_in, check_out)
);

-- Enable RLS on external_bookings
ALTER TABLE external_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Property owners can view external bookings for their properties
CREATE POLICY "Owners can view external bookings"
  ON external_bookings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties 
      WHERE properties.id = external_bookings.property_id 
      AND properties.owner_id = auth.uid()
    )
  );

-- Policy: Anyone can view external bookings (needed for availability check)
CREATE POLICY "Anyone can view external bookings for availability"
  ON external_bookings
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_external_bookings_property_dates 
  ON external_bookings(property_id, check_in, check_out);

-- Add trigger for updated_at
CREATE TRIGGER update_external_bookings_updated_at
  BEFORE UPDATE ON external_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE external_bookings IS 'Stores bookings imported from external calendar feeds (Airbnb, VRBO, etc.)';
COMMENT ON COLUMN properties.external_ical_urls IS 'Array of external iCal feed URLs to import (from Airbnb, VRBO, etc.)';