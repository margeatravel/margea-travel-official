
DO $$
DECLARE
  parent_id uuid := gen_random_uuid();
BEGIN
  -- Insert parent hotel
  INSERT INTO public.properties (
    id, title, description, location, property_type, unit_type,
    bedrooms, bathrooms, max_guests, minimum_nights, price_per_night,
    amenities, image_urls, available
  ) VALUES (
    parent_id,
    'Ana y Jose Hotel & Beach Club',
    'Luxury boutique beachfront hotel nestled on the pristine shores of Tulum Beach. Featuring world-class dining, a private beach club, spa services, and lush tropical gardens. An iconic destination that blends bohemian elegance with Mexican hospitality.',
    'Tulum Beach, Tulum, Mexico',
    'development', 'hotel',
    0, 0, 100, 1, 4500,
    ARRAY['Beach Club', 'Restaurant & Bar', 'Spa & Wellness', 'Pool', 'Private Beach', 'Concierge', 'Room Service', 'Yoga Classes', 'Bike Rentals', 'Wi-Fi', 'Air Conditioning', 'Parking'],
    ARRAY['/property-images/tulum-azara-hero.jpg', '/property-images/tulum-1.jpg', '/property-images/tulum-2.jpg'],
    true
  );

  -- Insert 6 room types
  INSERT INTO public.properties (title, description, location, property_type, unit_type, bedrooms, bathrooms, max_guests, minimum_nights, price_per_night, amenities, image_urls, available, parent_property_id, beds) VALUES
  ('Garden View Room', 'Cozy room surrounded by tropical gardens with natural light and private terrace. Features artisanal decor, premium linens, and rainforest shower.', 'Tulum Beach, Tulum, Mexico', 'room', 'room', 1, 1, 2, 1, 4500, ARRAY['Garden View','Private Terrace','King Bed','Rain Shower','A/C','Wi-Fi','Mini Bar','Safe'], ARRAY['/property-images/tulum-1.jpg'], true, parent_id, 1),
  ('Ocean View Room', 'Wake up to stunning Caribbean views from your private balcony. Spacious room with premium king bed, handcrafted furnishings, and luxurious bathroom.', 'Tulum Beach, Tulum, Mexico', 'room', 'room', 1, 1, 2, 1, 6800, ARRAY['Ocean View','Private Balcony','King Bed','Rain Shower','A/C','Wi-Fi','Mini Bar','Safe','Bathrobe & Slippers'], ARRAY['/property-images/tulum-2.jpg'], true, parent_id, 1),
  ('Superior Garden Suite', 'Spacious suite with separate living area nestled in lush gardens. Features a plunge pool, outdoor shower, and handmade Mexican furnishings.', 'Tulum Beach, Tulum, Mexico', 'room', 'room', 1, 1, 3, 1, 8500, ARRAY['Garden View','Private Plunge Pool','King Bed','Living Area','Outdoor Shower','A/C','Wi-Fi','Mini Bar','Safe'], ARRAY['/property-images/casa-azanik-1.jpg'], true, parent_id, 1),
  ('Oceanfront Suite', 'Premium beachfront suite with panoramic ocean views, private terrace with daybed, and direct beach access. The ultimate Tulum luxury experience.', 'Tulum Beach, Tulum, Mexico', 'room', 'room', 1, 1, 2, 1, 12000, ARRAY['Oceanfront','Private Terrace','Daybed','King Bed','Direct Beach Access','Rain Shower','Bathtub','A/C','Wi-Fi','Mini Bar','Safe','Nespresso Machine'], ARRAY['/property-images/tulum-2.jpg'], true, parent_id, 1),
  ('Two Bedroom Jungle Suite', 'Expansive two-bedroom suite immersed in the jungle canopy. Perfect for families or groups, with a private pool, full living area, and outdoor dining space.', 'Tulum Beach, Tulum, Mexico', 'room', 'room', 2, 2, 5, 2, 15000, ARRAY['Jungle View','Private Pool','2 King Beds','Living & Dining Area','Kitchenette','Outdoor Shower','A/C','Wi-Fi','Mini Bar','Safe'], ARRAY['/property-images/tulum-1.jpg'], true, parent_id, 2),
  ('Private Villa Cobá', 'The crown jewel — a standalone private villa with two bedrooms, private pool, outdoor living spaces, personal concierge, and complete seclusion.', 'Tulum Beach, Tulum, Mexico', 'villa', 'villa', 2, 2, 4, 3, 22000, ARRAY['Private Villa','Private Pool','Jungle & Ocean Views','2 King Beds','Full Kitchen','Outdoor Living Room','Personal Concierge','Direct Beach Access','A/C','Wi-Fi','Safe','Nespresso Machine'], ARRAY['/property-images/casa-azanik-1.jpg'], true, parent_id, 2);
END $$;
