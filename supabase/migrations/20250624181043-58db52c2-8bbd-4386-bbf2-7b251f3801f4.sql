
-- Check and create RLS policies only if they don't exist

-- Enable RLS on all tables (this is safe to run multiple times)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Products policies (skip if exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Users can view their own products'
    ) THEN
        CREATE POLICY "Users can view their own products" 
          ON public.products 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Users can create their own products'
    ) THEN
        CREATE POLICY "Users can create their own products" 
          ON public.products 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Users can update their own products'
    ) THEN
        CREATE POLICY "Users can update their own products" 
          ON public.products 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Users can delete their own products'
    ) THEN
        CREATE POLICY "Users can delete their own products" 
          ON public.products 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Orders policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' AND policyname = 'Users can view their own orders'
    ) THEN
        CREATE POLICY "Users can view their own orders" 
          ON public.orders 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' AND policyname = 'Users can create their own orders'
    ) THEN
        CREATE POLICY "Users can create their own orders" 
          ON public.orders 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' AND policyname = 'Users can update their own orders'
    ) THEN
        CREATE POLICY "Users can update their own orders" 
          ON public.orders 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'orders' AND policyname = 'Users can delete their own orders'
    ) THEN
        CREATE POLICY "Users can delete their own orders" 
          ON public.orders 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Order items policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' AND policyname = 'Users can view their own order items'
    ) THEN
        CREATE POLICY "Users can view their own order items" 
          ON public.order_items 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' AND policyname = 'Users can create their own order items'
    ) THEN
        CREATE POLICY "Users can create their own order items" 
          ON public.order_items 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' AND policyname = 'Users can update their own order items'
    ) THEN
        CREATE POLICY "Users can update their own order items" 
          ON public.order_items 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'order_items' AND policyname = 'Users can delete their own order items'
    ) THEN
        CREATE POLICY "Users can delete their own order items" 
          ON public.order_items 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Production records policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'production_records' AND policyname = 'Users can view their own production records'
    ) THEN
        CREATE POLICY "Users can view their own production records" 
          ON public.production_records 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'production_records' AND policyname = 'Users can create their own production records'
    ) THEN
        CREATE POLICY "Users can create their own production records" 
          ON public.production_records 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'production_records' AND policyname = 'Users can update their own production records'
    ) THEN
        CREATE POLICY "Users can update their own production records" 
          ON public.production_records 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'production_records' AND policyname = 'Users can delete their own production records'
    ) THEN
        CREATE POLICY "Users can delete their own production records" 
          ON public.production_records 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Labels policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'labels' AND policyname = 'Users can view their own labels'
    ) THEN
        CREATE POLICY "Users can view their own labels" 
          ON public.labels 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'labels' AND policyname = 'Users can create their own labels'
    ) THEN
        CREATE POLICY "Users can create their own labels" 
          ON public.labels 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'labels' AND policyname = 'Users can update their own labels'
    ) THEN
        CREATE POLICY "Users can update their own labels" 
          ON public.labels 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'labels' AND policyname = 'Users can delete their own labels'
    ) THEN
        CREATE POLICY "Users can delete their own labels" 
          ON public.labels 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Categories policies
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Users can view their own categories'
    ) THEN
        CREATE POLICY "Users can view their own categories" 
          ON public.categories 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Users can create their own categories'
    ) THEN
        CREATE POLICY "Users can create their own categories" 
          ON public.categories 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Users can update their own categories'
    ) THEN
        CREATE POLICY "Users can update their own categories" 
          ON public.categories 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'categories' AND policyname = 'Users can delete their own categories'
    ) THEN
        CREATE POLICY "Users can delete their own categories" 
          ON public.categories 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;
