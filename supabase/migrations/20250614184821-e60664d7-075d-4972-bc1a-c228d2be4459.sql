
-- Create enum for application roles
CREATE TYPE public.app_role AS ENUM ('admin', 'manager', 'staff');

-- Create enum for permissions
CREATE TYPE public.permission AS ENUM (
  'view_dashboard',
  'view_products', 'create_products', 'edit_products', 'delete_products',
  'view_categories', 'create_categories', 'edit_categories', 'delete_categories',
  'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
  'view_inventory', 'manage_inventory', 'view_locations', 'manage_locations',
  'view_orders', 'create_orders', 'edit_orders', 'delete_orders',
  'view_users', 'create_users', 'edit_users', 'delete_users',
  'view_reports', 'export_data',
  'manage_settings'
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create role_permissions table to define what each role can do
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  permission public.permission NOT NULL,
  UNIQUE(role, permission)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create security definer function to check user permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission public.permission)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id AND rp.permission = _permission
  )
$$;

-- Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS SETOF public.app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Create function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS SETOF public.permission
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT DISTINCT rp.permission
  FROM public.user_roles ur
  JOIN public.role_permissions rp ON ur.role = rp.role
  WHERE ur.user_id = _user_id
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for role_permissions
CREATE POLICY "Authenticated users can view role permissions" ON public.role_permissions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission) VALUES
-- Admin permissions (full access)
('admin', 'view_dashboard'),
('admin', 'view_products'), ('admin', 'create_products'), ('admin', 'edit_products'), ('admin', 'delete_products'),
('admin', 'view_categories'), ('admin', 'create_categories'), ('admin', 'edit_categories'), ('admin', 'delete_categories'),
('admin', 'view_suppliers'), ('admin', 'create_suppliers'), ('admin', 'edit_suppliers'), ('admin', 'delete_suppliers'),
('admin', 'view_inventory'), ('admin', 'manage_inventory'), ('admin', 'view_locations'), ('admin', 'manage_locations'),
('admin', 'view_orders'), ('admin', 'create_orders'), ('admin', 'edit_orders'), ('admin', 'delete_orders'),
('admin', 'view_users'), ('admin', 'create_users'), ('admin', 'edit_users'), ('admin', 'delete_users'),
('admin', 'view_reports'), ('admin', 'export_data'),
('admin', 'manage_settings'),

-- Manager permissions (most access, but can't manage users or settings)
('manager', 'view_dashboard'),
('manager', 'view_products'), ('manager', 'create_products'), ('manager', 'edit_products'), ('manager', 'delete_products'),
('manager', 'view_categories'), ('manager', 'create_categories'), ('manager', 'edit_categories'), ('manager', 'delete_categories'),
('manager', 'view_suppliers'), ('manager', 'create_suppliers'), ('manager', 'edit_suppliers'), ('manager', 'delete_suppliers'),
('manager', 'view_inventory'), ('manager', 'manage_inventory'), ('manager', 'view_locations'), ('manager', 'manage_locations'),
('manager', 'view_orders'), ('manager', 'create_orders'), ('manager', 'edit_orders'), ('manager', 'delete_orders'),
('manager', 'view_users'),
('manager', 'view_reports'), ('manager', 'export_data'),

-- Staff permissions (read-only and basic operations)
('staff', 'view_dashboard'),
('staff', 'view_products'), ('staff', 'edit_products'),
('staff', 'view_categories'),
('staff', 'view_suppliers'),
('staff', 'view_inventory'),
('staff', 'view_orders'), ('staff', 'create_orders'),
('staff', 'view_reports');

-- Update existing RLS policies to use permission-based access
-- Products table
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;

CREATE POLICY "Users with view_products permission can view products" ON public.products
  FOR SELECT USING (public.has_permission(auth.uid(), 'view_products'));

CREATE POLICY "Users with create_products permission can create products" ON public.products
  FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'create_products'));

CREATE POLICY "Users with edit_products permission can update products" ON public.products
  FOR UPDATE USING (public.has_permission(auth.uid(), 'edit_products'));

CREATE POLICY "Users with delete_products permission can delete products" ON public.products
  FOR DELETE USING (public.has_permission(auth.uid(), 'delete_products'));

-- Categories table
DROP POLICY IF EXISTS "Authenticated users can view categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;

CREATE POLICY "Users with view_categories permission can view categories" ON public.categories
  FOR SELECT USING (public.has_permission(auth.uid(), 'view_categories'));

CREATE POLICY "Users with create_categories permission can create categories" ON public.categories
  FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'create_categories'));

CREATE POLICY "Users with edit_categories permission can update categories" ON public.categories
  FOR UPDATE USING (public.has_permission(auth.uid(), 'edit_categories'));

CREATE POLICY "Users with delete_categories permission can delete categories" ON public.categories
  FOR DELETE USING (public.has_permission(auth.uid(), 'delete_categories'));

-- Suppliers table
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;

CREATE POLICY "Users with view_suppliers permission can view suppliers" ON public.suppliers
  FOR SELECT USING (public.has_permission(auth.uid(), 'view_suppliers'));

CREATE POLICY "Users with create_suppliers permission can create suppliers" ON public.suppliers
  FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'create_suppliers'));

CREATE POLICY "Users with edit_suppliers permission can update suppliers" ON public.suppliers
  FOR UPDATE USING (public.has_permission(auth.uid(), 'edit_suppliers'));

CREATE POLICY "Users with delete_suppliers permission can delete suppliers" ON public.suppliers
  FOR DELETE USING (public.has_permission(auth.uid(), 'delete_suppliers'));

-- Orders table
DROP POLICY IF EXISTS "Authenticated users can view orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users can manage orders" ON public.orders;

CREATE POLICY "Users with view_orders permission can view orders" ON public.orders
  FOR SELECT USING (public.has_permission(auth.uid(), 'view_orders'));

CREATE POLICY "Users with create_orders permission can create orders" ON public.orders
  FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'create_orders'));

CREATE POLICY "Users with edit_orders permission can update orders" ON public.orders
  FOR UPDATE USING (public.has_permission(auth.uid(), 'edit_orders'));

CREATE POLICY "Users with delete_orders permission can delete orders" ON public.orders
  FOR DELETE USING (public.has_permission(auth.uid(), 'delete_orders'));

-- Locations table
DROP POLICY IF EXISTS "Authenticated users can view locations" ON public.locations;
DROP POLICY IF EXISTS "Authenticated users can manage locations" ON public.locations;

CREATE POLICY "Users with view_locations permission can view locations" ON public.locations
  FOR SELECT USING (public.has_permission(auth.uid(), 'view_locations'));

CREATE POLICY "Users with manage_locations permission can manage locations" ON public.locations
  FOR ALL USING (public.has_permission(auth.uid(), 'manage_locations'));

-- Users table (for user management)
DROP POLICY IF EXISTS "Authenticated users can view users" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can manage users" ON public.users;

CREATE POLICY "Users with view_users permission can view users" ON public.users
  FOR SELECT USING (public.has_permission(auth.uid(), 'view_users'));

CREATE POLICY "Users with create_users permission can create users" ON public.users
  FOR INSERT WITH CHECK (public.has_permission(auth.uid(), 'create_users'));

CREATE POLICY "Users with edit_users permission can update users" ON public.users
  FOR UPDATE USING (public.has_permission(auth.uid(), 'edit_users'));

CREATE POLICY "Users with delete_users permission can delete users" ON public.users
  FOR DELETE USING (public.has_permission(auth.uid(), 'delete_users'));

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role);
CREATE INDEX idx_role_permissions_permission ON public.role_permissions(permission);
