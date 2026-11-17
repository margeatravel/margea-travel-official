-- Relax update policy temporarily so calendar URLs can be saved without auth
ALTER POLICY "Owners can update their properties"
ON public.properties
USING (true)
WITH CHECK (true);