
-- Create enum types for better data consistency
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive');
CREATE TYPE public.supplier_status AS ENUM ('active', 'inactive');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.location_type AS ENUM ('warehouse', 'store', 'distribution');
CREATE TYPE public.activity_type AS ENUM (
  'product_added', 'product_updated', 'product_deleted',
  'supplier_added', 'supplier_updated', 'supplier_deleted',
  'user_added', 'user_updated', 'user_deleted',
  'order_created', 'order_updated', 'order_deleted',
  'category_added', 'category_updated', 'category_deleted',
  'location_added', 'location_updated', 'location_deleted',
  'stock_updated', 'email_sent', 'data_exported'
);

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Suppliers table
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  status public.supplier_status DEFAULT 'active',
  products INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  type public.location_type NOT NULL,
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Users table (for application users, separate from auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role public.user_role DEFAULT 'employee',
  department TEXT,
  phone TEXT,
  status public.user_status DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
  status public.order_status DEFAULT 'pending',
  total_amount DECIMAL(10,2) NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expected_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activity log table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.activity_type NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can view categories" ON public.categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage categories" ON public.categories FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view suppliers" ON public.suppliers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage suppliers" ON public.suppliers FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view locations" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage locations" ON public.locations FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view products" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage products" ON public.products FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage users" ON public.users FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage orders" ON public.orders FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view order items" ON public.order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage order items" ON public.order_items FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can view activities" ON public.activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create activities" ON public.activities FOR INSERT TO authenticated WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_orders_supplier_id ON public.orders(supplier_id);
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_activities_type ON public.activities(type);
CREATE INDEX idx_activities_timestamp ON public.activities(timestamp);

-- Create functions to automatically update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert some sample data to get started
INSERT INTO public.categories (name, description) VALUES
('Electronics', 'Smartphones, laptops, tablets, and electronic accessories'),
('Clothing', 'Fashion and apparel for all ages'),
('Books', 'Fiction, non-fiction, educational, and reference books'),
('Home & Garden', 'Home improvement, furniture, and gardening supplies'),
('Sports', 'Sports equipment, fitness gear, and outdoor activities'),
('Food & Beverage', 'Groceries, snacks, beverages, and specialty foods');

INSERT INTO public.suppliers (name, contact, email, phone, address, products, total_orders) VALUES
('Apple Inc.', 'John Smith', 'orders@apple.com', '+1-800-275-2273', 'One Apple Park Way, Cupertino, CA', 25, 45),
('Nike Corporation', 'Sarah Johnson', 'supply@nike.com', '+1-800-344-6453', 'One Bowerman Drive, Beaverton, OR', 18, 32),
('Coffee Corp', 'Mike Wilson', 'orders@coffeecorp.com', '+1-555-0123', '123 Coffee St, Seattle, WA', 12, 28),
('Tech Solutions', 'Emily Brown', 'sales@techsolutions.com', '+1-555-0456', '456 Tech Ave, Austin, TX', 30, 67);

INSERT INTO public.locations (name, address, type, capacity) VALUES
('Main Warehouse', '123 Industrial Blvd, City', 'warehouse', 10000),
('Store A - Downtown', '456 Main St, Downtown', 'store', 500),
('Store B - Mall', '789 Mall Ave, Shopping Center', 'store', 300),
('Distribution Center', '321 Logistics Way, Outskirts', 'distribution', 5000);
