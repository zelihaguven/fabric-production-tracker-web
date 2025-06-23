
-- Ürünler tablosundan beden sayısı ve kategori alanlarını kaldır
ALTER TABLE public.products DROP COLUMN IF EXISTS size_count;
ALTER TABLE public.products DROP COLUMN IF EXISTS sizes;
ALTER TABLE public.products DROP COLUMN IF EXISTS category_id;

-- Ürünler tablosuna yeni alanlar ekle
ALTER TABLE public.products ADD COLUMN order_number TEXT;
ALTER TABLE public.products ADD COLUMN ordering_brand TEXT;
ALTER TABLE public.products ADD COLUMN fabric_number TEXT;
ALTER TABLE public.products ADD COLUMN fabric_status TEXT DEFAULT 'kumaş sipariş edildi' CHECK (fabric_status IN ('kumaş sipariş edildi', 'kumaş geldi', 'kumaş kesime girdi', 'kumaş hazır'));

-- Etiketler tablosuna yeni alanlar ekle
ALTER TABLE public.labels ADD COLUMN attached_model TEXT;
ALTER TABLE public.labels ADD COLUMN model_owner TEXT;
ALTER TABLE public.labels ADD COLUMN order_date DATE;
ALTER TABLE public.labels ADD COLUMN delivery_date DATE;

-- Brand alanının anlamını değiştiriyoruz (artık etiket üreticisi olacak)
COMMENT ON COLUMN public.labels.brand IS 'Etiket üreticisi';
