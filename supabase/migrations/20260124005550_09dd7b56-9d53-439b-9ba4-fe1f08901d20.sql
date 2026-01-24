-- Drop old tables that won't be needed
DROP TABLE IF EXISTS public.search_history CASCADE;
DROP TABLE IF EXISTS public.daily_searches CASCADE;
DROP TABLE IF EXISTS public.saved_leads CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.plans CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- Drop old functions/triggers
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_subscription CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user_role CASCADE;
DROP FUNCTION IF EXISTS public.has_role CASCADE;

-- Drop old enum
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table for product specs
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  year INTEGER,
  price_min NUMERIC,
  price_max NUMERIC,
  price_typical NUMERIC,
  -- Performance specs
  performance_score INTEGER DEFAULT 50,
  camera_score INTEGER DEFAULT 50,
  battery_score INTEGER DEFAULT 50,
  build_quality_score INTEGER DEFAULT 50,
  -- Detailed specs as JSONB for flexibility
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create comparison history (anonymous, for analytics)
CREATE TABLE public.comparison_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  current_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  new_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  usage_profile TEXT,
  camera_importance TEXT,
  battery_importance TEXT,
  budget_range TEXT,
  result_score INTEGER,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparison_stats ENABLE ROW LEVEL SECURITY;

-- Categories are public read
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

-- Products are public read
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Comparison stats are public insert (anonymous tracking)
CREATE POLICY "Anyone can insert comparison stats" 
ON public.comparison_stats FOR INSERT 
WITH CHECK (true);

-- Create index for product search
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_name ON public.products USING gin(to_tsvector('portuguese', name));

-- Insert initial categories
INSERT INTO public.categories (name, icon, slug) VALUES
  ('Smartphones', 'Smartphone', 'smartphones'),
  ('Notebooks', 'Laptop', 'notebooks'),
  ('Tablets', 'Tablet', 'tablets'),
  ('Fones de Ouvido', 'Headphones', 'fones'),
  ('Smart TVs', 'Tv', 'tvs'),
  ('Câmeras', 'Camera', 'cameras');

-- Insert sample smartphones for testing
INSERT INTO public.products (category_id, name, brand, model, year, price_min, price_max, price_typical, performance_score, camera_score, battery_score, build_quality_score) 
SELECT 
  c.id,
  p.name,
  p.brand,
  p.model,
  p.year,
  p.price_min,
  p.price_max,
  p.price_typical,
  p.performance_score,
  p.camera_score,
  p.battery_score,
  p.build_quality_score
FROM public.categories c,
(VALUES
  ('iPhone 13', 'Apple', 'A15', 2021, 2500, 3500, 3000, 85, 88, 80, 95),
  ('iPhone 14', 'Apple', 'A15', 2022, 3500, 4500, 4000, 87, 90, 82, 95),
  ('iPhone 15', 'Apple', 'A16', 2023, 4500, 5500, 5000, 92, 93, 85, 96),
  ('iPhone 15 Pro', 'Apple', 'A17', 2023, 6000, 7500, 6800, 98, 97, 88, 98),
  ('Galaxy S21', 'Samsung', 'Exynos 2100', 2021, 1800, 2800, 2200, 82, 85, 78, 90),
  ('Galaxy S22', 'Samsung', 'Exynos 2200', 2022, 2500, 3500, 3000, 86, 88, 80, 92),
  ('Galaxy S23', 'Samsung', 'Snapdragon 8 Gen 2', 2023, 3500, 4500, 4000, 92, 92, 85, 94),
  ('Galaxy S24', 'Samsung', 'Exynos 2400', 2024, 4000, 5000, 4500, 95, 94, 88, 95),
  ('Galaxy S25 FE', 'Samsung', 'Snapdragon 8 Gen 3', 2025, 3000, 4000, 3500, 90, 90, 86, 93),
  ('Redmi Note 12', 'Xiaomi', 'Snapdragon 685', 2023, 900, 1400, 1100, 65, 70, 85, 75),
  ('Redmi Note 13', 'Xiaomi', 'Snapdragon 7s Gen 2', 2024, 1200, 1800, 1500, 72, 75, 88, 78),
  ('Pixel 8', 'Google', 'Tensor G3', 2023, 3500, 4500, 4000, 88, 95, 82, 90),
  ('Pixel 8 Pro', 'Google', 'Tensor G3', 2023, 5000, 6000, 5500, 92, 98, 85, 92)
) AS p(name, brand, model, year, price_min, price_max, price_typical, performance_score, camera_score, battery_score, build_quality_score)
WHERE c.slug = 'smartphones';