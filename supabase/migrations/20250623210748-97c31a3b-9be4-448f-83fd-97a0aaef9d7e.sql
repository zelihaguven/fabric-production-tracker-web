
-- Ürün kategorileri tablosu
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ürünler tablosu
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  price DECIMAL(10,2),
  cost DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Siparişler tablosu
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2),
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sipariş detayları tablosu
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Üretim kayıtları tablosu
CREATE TABLE public.production_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity_produced INTEGER NOT NULL,
  production_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Row Level Security (RLS) etkinleştir
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;

-- Kategoriler için RLS politikaları
CREATE POLICY "Users can view their own categories" ON public.categories FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own categories" ON public.categories FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own categories" ON public.categories FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own categories" ON public.categories FOR DELETE USING (user_id = auth.uid());

-- Ürünler için RLS politikaları
CREATE POLICY "Users can view their own products" ON public.products FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own products" ON public.products FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own products" ON public.products FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own products" ON public.products FOR DELETE USING (user_id = auth.uid());

-- Siparişler için RLS politikaları
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own orders" ON public.orders FOR DELETE USING (user_id = auth.uid());

-- Sipariş detayları için RLS politikaları
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own order items" ON public.order_items FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own order items" ON public.order_items FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own order items" ON public.order_items FOR DELETE USING (user_id = auth.uid());

-- Üretim kayıtları için RLS politikaları
CREATE POLICY "Users can view their own production records" ON public.production_records FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create their own production records" ON public.production_records FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update their own production records" ON public.production_records FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete their own production records" ON public.production_records FOR DELETE USING (user_id = auth.uid());

-- Benzersiz indeksler
CREATE UNIQUE INDEX idx_products_sku_user ON public.products(sku, user_id) WHERE sku IS NOT NULL;
CREATE UNIQUE INDEX idx_orders_number_user ON public.orders(order_number, user_id);
