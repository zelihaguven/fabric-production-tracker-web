
-- Etiketler tablosu oluştur
CREATE TABLE public.labels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  order_status TEXT DEFAULT 'ordered' CHECK (order_status IN ('ordered', 'arrived')),
  received_quantity INTEGER DEFAULT 0,
  brand TEXT,
  count_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ürünler tablosuna renk ve beden alanları ekle
ALTER TABLE public.products ADD COLUMN color TEXT;
ALTER TABLE public.products ADD COLUMN size_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN sizes TEXT[];

-- Etiketler için RLS etkinleştir
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;

-- Etiketler için RLS politikaları
CREATE POLICY "Users can view their own labels" ON public.labels FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own labels" ON public.labels FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own labels" ON public.labels FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own labels" ON public.labels FOR DELETE USING (user_id = auth.uid());
