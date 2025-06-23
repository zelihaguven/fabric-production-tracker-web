
-- Ürünler tablosuna model sütunu ekleyelim
ALTER TABLE public.products ADD COLUMN model TEXT;

-- Üretim kayıtlarına defolu miktar sütunu ekleyelim
ALTER TABLE public.production_records ADD COLUMN defective_quantity INTEGER DEFAULT 0;

-- Siparişlere toplam teslim adedi sütunu ekleyelim
ALTER TABLE public.orders ADD COLUMN total_delivery_quantity INTEGER;
