-- Allow authenticated users to update external_ical_urls on their own properties
CREATE POLICY "Owners can update external_ical_urls"
ON public.properties
FOR UPDATE
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);