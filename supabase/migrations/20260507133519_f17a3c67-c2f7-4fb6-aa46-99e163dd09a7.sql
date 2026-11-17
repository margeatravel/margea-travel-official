
-- 1. custom_packages: restrict SELECT to admins only
DROP POLICY IF EXISTS "Anyone can view their own requests via email" ON public.custom_packages;
CREATE POLICY "Admins can view custom packages"
ON public.custom_packages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. properties: drop the wide-open update policy
DROP POLICY IF EXISTS "Anyone can update external_ical_urls" ON public.properties;

-- 3. concierge_requests: restrict SELECT to admins
DROP POLICY IF EXISTS "Authenticated users can view concierge requests" ON public.concierge_requests;
CREATE POLICY "Admins can view concierge requests"
ON public.concierge_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
