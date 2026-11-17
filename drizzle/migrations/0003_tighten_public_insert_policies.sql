-- Tables written only by backend functions (service role bypasses RLS): remove public INSERT
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can insert golf bookings" ON public.golf_bookings;
DROP POLICY IF EXISTS "Allow service role to insert transportation requests" ON public.transportation_requests;

-- Public request forms: only accept well-formed, new "pending" submissions
DROP POLICY IF EXISTS "Anyone can submit concierge requests" ON public.concierge_requests;
CREATE POLICY "Anyone can submit concierge requests" ON public.concierge_requests
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(contact_email) <= 255
  AND length(contact_name) BETWEEN 1 AND 200
  AND length(service_type) BETWEEN 1 AND 200
  AND length(coalesce(contact_phone, '')) <= 50
  AND length(coalesce(special_requests, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can submit charter requests" ON public.charter_requests;
CREATE POLICY "Anyone can submit charter requests" ON public.charter_requests
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND length(full_name) BETWEEN 1 AND 200
  AND passengers BETWEEN 1 AND 100
  AND length(origin) <= 300 AND length(destination) <= 300
  AND length(coalesce(phone, '')) <= 50
  AND length(coalesce(notes, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can create custom package requests" ON public.custom_packages;
CREATE POLICY "Anyone can create custom package requests" ON public.custom_packages
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND length(name) BETWEEN 1 AND 200
  AND guests BETWEEN 1 AND 100
  AND budget >= 0
  AND length(coalesce(phone, '')) <= 50
  AND length(coalesce(special_requests, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can create tour booking requests" ON public.tour_bookings;
CREATE POLICY "Anyone can create tour booking requests" ON public.tour_bookings
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND guest_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(guest_email) <= 255
  AND length(guest_name) BETWEEN 1 AND 200
  AND length(tour_name) BETWEEN 1 AND 300
  AND (guests IS NULL OR guests BETWEEN 1 AND 100)
  AND length(coalesce(guest_phone, '')) <= 50
  AND length(coalesce(special_requests, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can submit property requests" ON public.property_requests;
CREATE POLICY "Anyone can submit property requests" ON public.property_requests
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(contact_email) <= 255
  AND length(contact_name) BETWEEN 1 AND 200
  AND length(property_title) BETWEEN 1 AND 300
  AND length(property_description) <= 10000
  AND length(coalesce(contact_phone, '')) <= 50
  AND length(coalesce(additional_info, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can create order drafts" ON public.order_drafts;
CREATE POLICY "Anyone can create order drafts" ON public.order_drafts
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'draft'
  AND stripe_session_id IS NULL
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND length(full_name) BETWEEN 1 AND 200
  AND length(phone) <= 50
  AND length(coalesce(notes, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can join Margea Members" ON public.members;
CREATE POLICY "Anyone can join Margea Members" ON public.members
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND credits_balance = 0
  AND user_id IS NULL
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND length(first_name) BETWEEN 1 AND 100
  AND length(last_name) BETWEEN 1 AND 100
  AND length(phone) <= 50
  AND length(country) <= 100
);

DROP POLICY IF EXISTS "Anyone can submit golf inquiries" ON public.golf_inquiries;
CREATE POLICY "Anyone can submit golf inquiries" ON public.golf_inquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255
  AND length(full_name) BETWEEN 1 AND 200
  AND number_of_players BETWEEN 1 AND 50
  AND length(phone) <= 50
  AND length(coalesce(message, '')) <= 5000
);

DROP POLICY IF EXISTS "Anyone can create yacht booking requests" ON public.yacht_bookings;
CREATE POLICY "Anyone can create yacht booking requests" ON public.yacht_bookings
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND guest_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(guest_email) <= 255
  AND length(guest_name) BETWEEN 1 AND 200
  AND (guests IS NULL OR guests BETWEEN 1 AND 100)
  AND length(coalesce(guest_phone, '')) <= 50
  AND length(coalesce(special_requests, '')) <= 5000
);

-- Shared carts: visitors may only stamp used_at on an unused, unexpired cart
DROP POLICY IF EXISTS "Anyone can mark an unused shared cart as used" ON public.shared_carts;
REVOKE UPDATE ON public.shared_carts FROM anon, authenticated;
GRANT UPDATE (used_at) ON public.shared_carts TO anon, authenticated;
CREATE POLICY "Anyone can mark an unused shared cart as used" ON public.shared_carts
FOR UPDATE TO anon, authenticated
USING (used_at IS NULL AND expires_at > now())
WITH CHECK (used_at IS NOT NULL AND used_at <= now() + interval '10 minutes');

-- Public bucket files stay reachable by public URL; stop anyone from listing every object
DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;