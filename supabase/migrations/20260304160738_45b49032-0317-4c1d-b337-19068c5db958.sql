UPDATE properties SET image_urls = ARRAY[
  '/property-images/tulum-1.jpg',
  '/property-images/bungalow-village-amenities-1.jpeg',
  '/property-images/bungalow-village-amenities-2.jpeg',
  '/property-images/bungalow-village-amenities-3.jpeg',
  '/property-images/bungalow-village-amenities-4.jpeg',
  '/property-images/bungalow-village-amenities-5.jpeg',
  '/property-images/bungalow-village-amenities-6.jpeg',
  '/property-images/bungalow-village-amenities-7.jpeg',
  '/property-images/bungalow-village-amenities-8.jpeg'
] WHERE id IN (
  '83299490-e6ca-4ec8-b5b6-ff30304095c5',
  'a5ec6957-a57d-49a0-b4e7-c51183468b05',
  'ae1835c3-4c0a-4f4e-82ee-baf1986e258e'
);