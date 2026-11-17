-- Step 1: Add owner_id to properties table
ALTER TABLE public.properties 
ADD COLUMN owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Step 2: Add booking_reference to bookings table for secure guest access
ALTER TABLE public.bookings 
ADD COLUMN booking_reference TEXT UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex');

-- Step 3: Create index for performance
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);

-- Step 4: Drop overly permissive RLS policies on properties
DROP POLICY IF EXISTS "Allow public inserts to properties" ON public.properties;
DROP POLICY IF EXISTS "Allow public updates to properties" ON public.properties;
DROP POLICY IF EXISTS "Allow public deletes to properties" ON public.properties;
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;

-- Step 5: Drop public access policy on bookings
DROP POLICY IF EXISTS "Bookings are viewable by everyone" ON public.bookings;

-- Step 6: Create secure RLS policies for properties
CREATE POLICY "Properties are viewable by everyone"
  ON public.properties
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create properties"
  ON public.properties
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their properties"
  ON public.properties
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their properties"
  ON public.properties
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Step 7: Create secure RLS policies for bookings
-- Property owners can view bookings for their properties
CREATE POLICY "Property owners can view bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.properties
      WHERE properties.id = bookings.property_id
      AND properties.owner_id = auth.uid()
    )
  );

-- Step 8: Keep public insert for bookings (guests need to book)
-- The existing "Anyone can create bookings" policy remains active