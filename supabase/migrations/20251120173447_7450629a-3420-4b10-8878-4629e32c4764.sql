-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Owners can update external_ical_urls" ON public.properties;

-- Create a new public policy for updating external_ical_urls
CREATE POLICY "Anyone can update external_ical_urls"
ON public.properties
FOR UPDATE
USING (true)
WITH CHECK (true);