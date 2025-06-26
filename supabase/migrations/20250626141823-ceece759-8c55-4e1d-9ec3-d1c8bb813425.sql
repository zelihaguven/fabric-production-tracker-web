
-- Şirketler tablosu oluştur
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  company_code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Profiles tablosuna company_id ekle
ALTER TABLE public.profiles ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- RLS politikaları ekle
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Şirket oluşturanlar kendi şirketlerini görebilir
CREATE POLICY "Users can view their company" 
  ON public.companies 
  FOR SELECT 
  USING (created_by = auth.uid() OR id IN (
    SELECT company_id FROM public.profiles WHERE id = auth.uid()
  ));

-- Kullanıcılar şirket oluşturabilir
CREATE POLICY "Users can create companies" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- Mevcut RLS politikalarını güncelle - aynı şirketteki kullanıcılar birbirlerinin verilerini görebilsin
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Users can create their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;

CREATE POLICY "Users can view company products" 
  ON public.products 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create company products" 
  ON public.products 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update company products" 
  ON public.products 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can delete company products" 
  ON public.products 
  FOR DELETE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

-- Production records için de aynı politikaları uygula
DROP POLICY IF EXISTS "Users can view their own production records" ON public.production_records;
DROP POLICY IF EXISTS "Users can create their own production records" ON public.production_records;
DROP POLICY IF EXISTS "Users can update their own production records" ON public.production_records;
DROP POLICY IF EXISTS "Users can delete their own production records" ON public.production_records;

CREATE POLICY "Users can view company production records" 
  ON public.production_records 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create company production records" 
  ON public.production_records 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update company production records" 
  ON public.production_records 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can delete company production records" 
  ON public.production_records 
  FOR DELETE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

-- Orders için de aynı politikaları uygula
CREATE POLICY "Users can view company orders" 
  ON public.orders 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create company orders" 
  ON public.orders 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update company orders" 
  ON public.orders 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can delete company orders" 
  ON public.orders 
  FOR DELETE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

-- Labels için de aynı politikaları uygula
CREATE POLICY "Users can view company labels" 
  ON public.labels 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create company labels" 
  ON public.labels 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update company labels" 
  ON public.labels 
  FOR UPDATE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

CREATE POLICY "Users can delete company labels" 
  ON public.labels 
  FOR DELETE 
  USING (
    user_id = auth.uid() OR 
    user_id IN (
      SELECT p.id FROM public.profiles p 
      JOIN public.profiles cu ON cu.company_id = p.company_id 
      WHERE cu.id = auth.uid() AND p.company_id IS NOT NULL
    )
  );

-- Benzersiz şirket kodu oluşturmak için fonksiyon
CREATE OR REPLACE FUNCTION generate_unique_company_code() 
RETURNS TEXT 
LANGUAGE plpgsql 
AS $$
DECLARE
  code TEXT;
  exists_flag BOOLEAN;
BEGIN
  LOOP
    -- 6 haneli alfanumerik kod oluştur
    code := upper(substring(md5(random()::text) from 1 for 6));
    
    -- Kodun mevcut olup olmadığını kontrol et
    SELECT EXISTS(SELECT 1 FROM public.companies WHERE company_code = code) INTO exists_flag;
    
    -- Eğer kod mevcut değilse döngüden çık
    IF NOT exists_flag THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;
