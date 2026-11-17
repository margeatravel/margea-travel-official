-- ============================================================
-- Lock down PII / sensitive data: admin-only SELECT
-- ============================================================

-- tour_bookings
DROP POLICY IF EXISTS "Anyone can view tour bookings" ON public.tour_bookings;
CREATE POLICY "Admins can view tour bookings"
ON public.tour_bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- yacht_bookings
DROP POLICY IF EXISTS "Anyone can view yacht bookings" ON public.yacht_bookings;
CREATE POLICY "Admins can view yacht bookings"
ON public.yacht_bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- charter_requests
DROP POLICY IF EXISTS "Anyone can view charter requests" ON public.charter_requests;
CREATE POLICY "Admins can view charter requests"
ON public.charter_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- golf_bookings
DROP POLICY IF EXISTS "Anyone can view golf bookings" ON public.golf_bookings;
CREATE POLICY "Admins can view golf bookings"
ON public.golf_bookings FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Service role can update golf bookings" ON public.golf_bookings;
CREATE POLICY "Admins can update golf bookings"
ON public.golf_bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- golf_inquiries
DROP POLICY IF EXISTS "Anyone can view golf inquiries" ON public.golf_inquiries;
CREATE POLICY "Admins can view golf inquiries"
ON public.golf_inquiries FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- order_drafts
DROP POLICY IF EXISTS "Anyone can view order drafts" ON public.order_drafts;
DROP POLICY IF EXISTS "Anyone can update order drafts" ON public.order_drafts;
CREATE POLICY "Admins can view order drafts"
ON public.order_drafts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update order drafts"
ON public.order_drafts FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- transportation_requests
DROP POLICY IF EXISTS "Allow service role to select transportation requests" ON public.transportation_requests;
DROP POLICY IF EXISTS "Allow service role to update transportation requests" ON public.transportation_requests;
CREATE POLICY "Admins can view transportation requests"
ON public.transportation_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update transportation requests"
ON public.transportation_requests FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- external_bookings: remove public exposure of source_url tokens
DROP POLICY IF EXISTS "Anyone can view external booking dates for availability" ON public.external_bookings;
-- public availability lookups already use the SECURITY DEFINER function
-- public.get_property_blocked_dates() which exposes only check_in/check_out.

-- properties: fix broken owner update policy
DROP POLICY IF EXISTS "Owners can update their properties" ON public.properties;
CREATE POLICY "Owners can update their properties"
ON public.properties FOR UPDATE TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- property_requests: admin-only SELECT
DROP POLICY IF EXISTS "Only authenticated users can view requests" ON public.property_requests;
CREATE POLICY "Admins can view property requests"
ON public.property_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
