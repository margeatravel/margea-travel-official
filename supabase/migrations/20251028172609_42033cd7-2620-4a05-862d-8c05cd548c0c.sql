-- Add INSERT policy for properties table so admin can add properties
CREATE POLICY "Allow public inserts to properties"
ON public.properties
FOR INSERT
WITH CHECK (true);

-- Add UPDATE policy for properties table so admin can update properties
CREATE POLICY "Allow public updates to properties"
ON public.properties
FOR UPDATE
USING (true);

-- Add DELETE policy for properties table so admin can delete properties
CREATE POLICY "Allow public deletes to properties"
ON public.properties
FOR DELETE
USING (true);