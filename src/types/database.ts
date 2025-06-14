
import { Database } from '@/integrations/supabase/types';

// Types matching our database schema - using Supabase generated types
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  products: number;
  total_orders: number;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  code?: string | null;
  category_id?: string;
  supplier_id?: string;
  price: number;
  cost?: number;
  stock: number;
  low_stock_threshold: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: 'warehouse' | 'store' | 'distribution';
  capacity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  profile_id?: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  phone?: string;
  status: 'active' | 'inactive';
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  supplier_id?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  order_date?: string;
  expected_delivery?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id?: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at?: string;
}

export interface Activity {
  id: string;
  type: Database['public']['Enums']['activity_type'];
  description: string;
  user_id?: string;
  timestamp?: string;
}
