
-- Update room names and images for Ana y Jose Hotel
UPDATE public.properties SET title = 'Manglar', image_urls = ARRAY['/hotel-images/anayiose-manglar.jpeg'] WHERE title = 'Garden View Room' AND parent_property_id IS NOT NULL;
UPDATE public.properties SET title = 'Charming Garden View', image_urls = ARRAY['/hotel-images/anayiose-charming-garden-view.jpeg'] WHERE title = 'Ocean View Room' AND parent_property_id IS NOT NULL;
UPDATE public.properties SET title = 'Superior Garden View', image_urls = ARRAY['/hotel-images/anayiose-superior-garden-view.jpeg'] WHERE title = 'Superior Garden Suite' AND parent_property_id IS NOT NULL;
UPDATE public.properties SET title = 'Charming Ocean View', image_urls = ARRAY['/hotel-images/anayiose-charming-ocean-view.jpeg'] WHERE title = 'Oceanfront Suite' AND parent_property_id IS NOT NULL;
UPDATE public.properties SET title = 'Feelings Ocean View', image_urls = ARRAY['/hotel-images/anayiose-feelings-ocean-view.jpeg'], price_per_night = 9500 WHERE title = 'Two Bedroom Jungle Suite' AND parent_property_id IS NOT NULL;
UPDATE public.properties SET title = 'Two Bedroom Suite Jungle View', image_urls = ARRAY['/hotel-images/anayiose-two-bedroom-jungle-suite.jpeg'], price_per_night = 15000 WHERE title = 'Private Villa Cobá' AND parent_property_id IS NOT NULL;

-- Insert the Villa Coba as a new room type
INSERT INTO public.properties (title, description, location, property_type, unit_type, bedrooms, bathrooms, max_guests, minimum_nights, price_per_night, amenities, image_urls, available, parent_property_id, beds)
SELECT 'Villa Cobá', 'The crown jewel — a standalone private villa with two bedrooms, private pool, outdoor living spaces, personal concierge, and complete seclusion.', 'Tulum Beach, Tulum, Mexico', 'villa', 'villa', 2, 2, 4, 3, 22000, ARRAY['Private Villa','Private Pool','Jungle & Ocean Views','2 King Beds','Full Kitchen','Outdoor Living Room','Personal Concierge','Direct Beach Access','A/C','Wi-Fi','Safe','Nespresso Machine'], ARRAY['/hotel-images/anayiose-villa-coba.jpeg'], true, id, 2
FROM public.properties WHERE unit_type = 'hotel' AND title LIKE '%Ana y Jose%' LIMIT 1;
