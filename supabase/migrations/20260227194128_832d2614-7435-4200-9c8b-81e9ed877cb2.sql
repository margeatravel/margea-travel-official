
CREATE TABLE public.order_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_json JSONB NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  lodging TEXT NOT NULL,
  checkin DATE NOT NULL,
  checkout DATE NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.order_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create order drafts" ON public.order_drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view order drafts" ON public.order_drafts FOR SELECT USING (true);
CREATE POLICY "Anyone can update order drafts" ON public.order_drafts FOR UPDATE USING (true);

CREATE TRIGGER update_order_drafts_updated_at
  BEFORE UPDATE ON public.order_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
