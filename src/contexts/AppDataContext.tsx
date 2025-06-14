
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost?: number;
  stock: number;
  lowStockThreshold: number;
  supplier: string;
  description?: string;
  status: 'active' | 'low_stock' | 'out_of_stock';
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email: string;
  phone?: string;
  address?: string;
  notes?: string;
  products: number;
  totalOrders: number;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount: number;
}

export interface Location {
  id: string;
  name: string;
  address?: string;
  type: 'warehouse' | 'store' | 'distribution';
  capacity?: number;
  status: 'active' | 'inactive';
}

interface AppDataContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<void>;
  
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'products' | 'totalOrders' | 'status'>) => Promise<void>;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Promise<void>;
  
  // Locations
  locations: Location[];
  addLocation: (location: Omit<Location, 'id' | 'status'>) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

// Initial data
const initialProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    sku: 'IPH15P-256-TB',
    category: 'electronics',
    price: 999.99,
    cost: 750.00,
    stock: 45,
    lowStockThreshold: 10,
    supplier: 'apple',
    status: 'active',
    description: 'Latest iPhone model with advanced features'
  },
  {
    id: '2',
    name: 'Nike Air Max 90',
    sku: 'NAM90-BLK-42',
    category: 'clothing',
    price: 129.99,
    cost: 80.00,
    stock: 3,
    lowStockThreshold: 5,
    supplier: 'nike',
    status: 'low_stock',
    description: 'Classic Nike sneakers'
  },
  {
    id: '3',
    name: 'MacBook Pro 16"',
    sku: 'MBP16-512-SG',
    category: 'electronics',
    price: 2499.99,
    cost: 1800.00,
    stock: 12,
    lowStockThreshold: 8,
    supplier: 'apple',
    status: 'active',
    description: 'Professional laptop for power users'
  },
  {
    id: '4',
    name: 'Coffee Beans Premium',
    sku: 'CFB-PREM-1KG',
    category: 'food-beverage',
    price: 24.99,
    cost: 12.00,
    stock: 0,
    lowStockThreshold: 20,
    supplier: 'coffee-corp',
    status: 'out_of_stock',
    description: 'Premium quality coffee beans'
  },
];

const initialSuppliers: Supplier[] = [
  {
    id: 'apple',
    name: 'Apple Inc.',
    contact: 'John Smith',
    email: 'orders@apple.com',
    phone: '+1-800-275-2273',
    address: 'One Apple Park Way, Cupertino, CA',
    products: 23,
    totalOrders: 156,
    status: 'active',
  },
  {
    id: 'nike',
    name: 'Nike Sports',
    contact: 'Sarah Johnson',
    email: 'supply@nike.com',
    phone: '+1-503-671-6453',
    address: 'One Bowerman Drive, Beaverton, OR',
    products: 45,
    totalOrders: 89,
    status: 'active',
  },
  {
    id: 'samsung',
    name: 'Samsung Electronics',
    contact: 'Kim Lee',
    email: 'b2b@samsung.com',
    phone: '+82-2-2255-0114',
    address: 'Seoul, South Korea',
    products: 67,
    totalOrders: 234,
    status: 'active',
  },
  {
    id: 'coffee-corp',
    name: 'Coffee Corp',
    contact: 'Maria Garcia',
    email: 'wholesale@coffeecorp.com',
    phone: '+1-555-123-4567',
    address: 'Portland, OR',
    products: 12,
    totalOrders: 45,
    status: 'inactive',
  },
];

const initialCategories: Category[] = [
  { id: 'electronics', name: 'Electronics', description: 'Electronic devices and accessories', productCount: 125 },
  { id: 'clothing', name: 'Clothing', description: 'Apparel and fashion items', productCount: 89 },
  { id: 'books', name: 'Books', description: 'Books and educational materials', productCount: 67 },
  { id: 'home-garden', name: 'Home & Garden', description: 'Home improvement and gardening supplies', productCount: 45 },
  { id: 'sports', name: 'Sports', description: 'Sports and fitness equipment', productCount: 78 },
  { id: 'food-beverage', name: 'Food & Beverage', description: 'Food items and beverages', productCount: 34 },
];

const initialLocations: Location[] = [
  { id: '1', name: 'Main Warehouse', address: '123 Industrial St, City, State', type: 'warehouse', capacity: 10000, status: 'active' },
  { id: '2', name: 'Downtown Store', address: '456 Main St, Downtown', type: 'store', capacity: 500, status: 'active' },
  { id: '3', name: 'Distribution Center', address: '789 Logistics Ave, Industrial Zone', type: 'distribution', capacity: 5000, status: 'active' },
];

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isLoading, setIsLoading] = useState(false);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'status'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        status: productData.stock === 0 ? 'out_of_stock' : 
                productData.stock <= productData.lowStockThreshold ? 'low_stock' : 'active'
      };
      
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Product added successfully!');
    } catch (error) {
      toast.error('Failed to add product. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addSupplier = useCallback(async (supplierData: Omit<Supplier, 'id' | 'products' | 'totalOrders' | 'status'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newSupplier: Supplier = {
        ...supplierData,
        id: Date.now().toString(),
        products: 0,
        totalOrders: 0,
        status: 'active'
      };
      
      setSuppliers(prev => [newSupplier, ...prev]);
      toast.success('Supplier added successfully!');
    } catch (error) {
      toast.error('Failed to add supplier. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'productCount'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newCategory: Category = {
        ...categoryData,
        id: Date.now().toString(),
        productCount: 0
      };
      
      setCategories(prev => [newCategory, ...prev]);
      toast.success('Category added successfully!');
    } catch (error) {
      toast.error('Failed to add category. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addLocation = useCallback(async (locationData: Omit<Location, 'id' | 'status'>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLocation: Location = {
        ...locationData,
        id: Date.now().toString(),
        status: 'active'
      };
      
      setLocations(prev => [newLocation, ...prev]);
      toast.success('Location added successfully!');
    } catch (error) {
      toast.error('Failed to add location. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AppDataContextType = {
    products,
    addProduct,
    suppliers,
    addSupplier,
    categories,
    addCategory,
    locations,
    addLocation,
    isLoading,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};
