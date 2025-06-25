
-- Products tablosuna created_by ve updated_by kolonları ekle
ALTER TABLE public.products 
ADD COLUMN created_by uuid REFERENCES auth.users(id),
ADD COLUMN updated_by uuid REFERENCES auth.users(id);

-- Orders tablosuna created_by ve updated_by kolonları ekle  
ALTER TABLE public.orders
ADD COLUMN created_by uuid REFERENCES auth.users(id),
ADD COLUMN updated_by uuid REFERENCES auth.users(id);

-- Production records tablosuna created_by ve updated_by kolonları ekle
ALTER TABLE public.production_records
ADD COLUMN created_by uuid REFERENCES auth.users(id),
ADD COLUMN updated_by uuid REFERENCES auth.users(id);

-- Labels tablosuna created_by ve updated_by kolonları ekle
ALTER TABLE public.labels
ADD COLUMN created_by uuid REFERENCES auth.users(id),
ADD COLUMN updated_by uuid REFERENCES auth.users(id);

-- Mevcut kayıtları güncellemek için user_id'lerini created_by ve updated_by'a kopyala
UPDATE public.products SET created_by = user_id, updated_by = user_id WHERE created_by IS NULL;
UPDATE public.orders SET created_by = user_id, updated_by = user_id WHERE created_by IS NULL;
UPDATE public.production_records SET created_by = user_id, updated_by = user_id WHERE created_by IS NULL;
UPDATE public.labels SET created_by = user_id, updated_by = user_id WHERE created_by IS NULL;

-- Gelecekte created_by'ın otomatik doldurulması için default değerler (opsiyonel)
-- Bu kısım manuel kontrol için şimdilik eklenmeyecek
