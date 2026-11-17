CREATE TABLE public.member_rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  points_cost integer NOT NULL,
  category text NOT NULL DEFAULT 'general',
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.member_rewards TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.member_rewards TO authenticated;
GRANT ALL ON public.member_rewards TO service_role;

ALTER TABLE public.member_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Signed-in users can view active rewards"
ON public.member_rewards FOR SELECT TO authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage rewards"
ON public.member_rewards FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_member_rewards_updated_at
BEFORE UPDATE ON public.member_rewards
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.member_rewards (title, description, points_cost, category, sort_order) VALUES
('$50 off your next stay', 'Redeem for a $50 credit on any direct booking with Margea.', 500, 'stays', 1),
('$150 off your next stay', 'Redeem for a $150 credit on any direct booking of 4 nights or more.', 1500, 'stays', 2),
('Complimentary airport transfer', 'Private round-trip transfer between Cancun airport and your villa.', 1000, 'transport', 3),
('Free cenote tour for two', 'Two seats on our Cenote Adventuring experience, transport included.', 1200, 'tours', 4),
('Late checkout & welcome basket', 'Extend your stay to 2pm plus a curated local welcome basket.', 300, 'upgrades', 5),
('Private chef dinner for two', 'An in-villa dinner prepared by one of our private chefs.', 2500, 'upgrades', 6);