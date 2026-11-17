-- ARTICLES
CREATE TABLE public.member_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image_url text,
  category text NOT NULL DEFAULT 'Travel Guide',
  read_time text NOT NULL DEFAULT '4 min read',
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.member_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published articles" ON public.member_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Admins manage articles" ON public.member_articles FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_member_articles_updated_at BEFORE UPDATE ON public.member_articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- EXPERIENCES
CREATE TABLE public.member_experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.member_experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active experiences" ON public.member_experiences FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage experiences" ON public.member_experiences FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_member_experiences_updated_at BEFORE UPDATE ON public.member_experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- OFFERS
CREATE TABLE public.member_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  valid_until date,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.member_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active offers" ON public.member_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage offers" ON public.member_offers FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_member_offers_updated_at BEFORE UPDATE ON public.member_offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- SEED DATA
INSERT INTO public.member_articles (title, excerpt, content, category, read_time) VALUES
('The Riviera Maya''s Hidden Cenotes Only Locals Know', 'Beyond the famous swimming spots lies a network of secret freshwater sanctuaries. Here is where to find the most magical ones.', E'## A World Beneath the Jungle\n\nThe Yucatán Peninsula sits atop the world''s largest underground river system. While travelers flock to Gran Cenote and Dos Ojos, our concierges know dozens of lesser-known cenotes where you can swim in complete solitude.\n\n### Cenote Cristalino\nA short drive south of Playa del Carmen, this open-air cenote offers crystalline water and a quiet jungle setting away from the crowds.\n\n### Cenote Carwash\nDespite its odd name, this is one of the most photogenic cenotes near Tulum, with lily pads floating on emerald water.\n\n### Cenote Tak Be Ha\nA fully underground cavern lit by dramatic spotlights — surreal and unforgettable.\n\n### How to Visit\nAsk your Margea concierge to arrange a private guide and transportation. Most local operators rush you in and out — we curate a slower, more intentional experience.', 'Insider Tips', '5 min read'),
('A Slow Day in Tulum: The Margea Way', 'Forget the rush. The most luxurious thing you can do in Tulum is nothing at all — and we will show you exactly how.', E'## Mornings\n\nStart with breakfast at your villa, prepared by a private chef. We recommend fresh papaya, huevos rancheros, and locally-roasted Chiapas coffee.\n\n## Midday\n\nA short drive takes you to a private beach club where lounge chairs are already reserved in your name. No queues, no hassle.\n\n## Sunset\n\nReturn to your villa for a candle-lit dinner under the stars, prepared in-house.\n\nThis is what membership unlocks: a day designed entirely around you.', 'Travel Guide', '4 min read'),
('Why We Choose Akumal Over Cancún for Couples', 'A quieter coastline, sea turtles at your doorstep, and the kind of stillness that resets your nervous system.', E'## The Case for Akumal\n\nAkumal — meaning "Place of the Turtles" in Mayan — has long been a secret kept by repeat visitors. While Cancún delivers energy and nightlife, Akumal offers something rarer: silence.\n\n## What Makes It Special\n\n- Direct beach access without the crowds\n- Year-round sea turtle sightings just steps from shore\n- A small, walkable village with authentic restaurants\n- Proximity to Tulum and the cenote belt\n\n## Where to Stay\n\nOur curated Akumal portfolio includes oceanfront villas with private pools and dedicated concierge service. Casa Azanik remains our flagship.', 'Destination', '6 min read');

INSERT INTO public.member_experiences (name, description, sort_order) VALUES
('Private Cenote Tour', 'A guided journey through three private cenotes most travelers never see. Includes private transport, expert guide, and a curated picnic.', 1),
('Sunset Yacht Charter', 'A four-hour private sailing experience along the Riviera Maya coastline with onboard chef, premium drinks, and snorkel stops.', 2),
('Tulum Ruins at Sunrise', 'Members-only access to the Tulum archaeological zone before public hours. Walk the cliffside ruins in golden morning light.', 3),
('Whale Shark Swim Experience', 'Seasonal (May–September). A private boat charter to swim alongside whale sharks in the open ocean off Isla Mujeres.', 4);

INSERT INTO public.member_offers (title, description, valid_until, sort_order) VALUES
('10% off your next direct booking', 'Members receive an automatic 10% discount on any direct stay booked through Margea. Cannot be combined with seasonal promotions.', '2025-12-31', 1),
('Complimentary airport transfer on stays of 5+ nights', 'Book a stay of five nights or more and we will arrange a complimentary private airport transfer in either direction.', '2025-12-31', 2);