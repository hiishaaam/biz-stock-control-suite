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

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  phone?: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  supplier: string;
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  type: 'product_added' | 'product_updated' | 'product_deleted' | 'stock_updated' | 'supplier_added' | 'supplier_updated' | 'supplier_deleted' | 'category_added' | 'category_updated' | 'category_deleted' | 'location_added' | 'location_updated' | 'location_deleted' | 'user_added' | 'user_updated' | 'user_deleted' | 'order_created' | 'order_updated' | 'order_deleted' | 'email_sent' | 'data_exported';
  description: string;
  timestamp: string;
  entityName?: string;
}

interface AppDataContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id' | 'products' | 'totalOrders' | 'status'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  
  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Locations
  locations: Location[];
  addLocation: (location: Omit<Location, 'id' | 'status'>) => Promise<void>;
  updateLocation: (id: string, location: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'status'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  
  // Activities
  activities: Activity[];
  
  // Utility functions
  sendEmail: (to: string, subject: string, message: string) => Promise<void>;
  exportData: (type: 'products' | 'suppliers' | 'categories' | 'orders', format: 'csv' | 'pdf') => Promise<void>;
  
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

const initialUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john@company.com',
    role: 'admin',
    department: 'Management',
    phone: '+1-555-0100',
    status: 'active',
    lastLogin: '2025-06-14T10:30:00Z',
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@company.com',
    role: 'manager',
    department: 'Inventory',
    phone: '+1-555-0101',
    status: 'active',
    lastLogin: '2025-06-14T09:15:00Z',
  },
  {
    id: '3',
    name: 'Mike Employee',
    email: 'mike@company.com',
    role: 'employee',
    department: 'Warehouse',
    phone: '+1-555-0102',
    status: 'active',
    lastLogin: '2025-06-13T16:45:00Z',
  },
];

const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    supplier: 'apple',
    items: [
      { productId: '1', quantity: 20, price: 750.00 },
      { productId: '3', quantity: 5, price: 1800.00 },
    ],
    totalAmount: 24000.00,
    status: 'confirmed',
    orderDate: '2025-06-10T10:00:00Z',
    expectedDelivery: '2025-06-20T10:00:00Z',
    notes: 'Priority order for new product launch',
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    supplier: 'nike',
    items: [
      { productId: '2', quantity: 50, price: 80.00 },
    ],
    totalAmount: 4000.00,
    status: 'pending',
    orderDate: '2025-06-12T14:30:00Z',
    expectedDelivery: '2025-06-25T14:30:00Z',
  },
];

const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'product_added',
    description: 'Added new product "Samsung Galaxy S24"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    entityName: 'Samsung Galaxy S24',
  },
  {
    id: '2',
    type: 'stock_updated',
    description: 'Updated stock for "Nike Air Jordan" - Added 50 units',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    entityName: 'Nike Air Jordan',
  },
  {
    id: '3',
    type: 'supplier_added',
    description: 'New supplier "TechCorp Solutions" added',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    entityName: 'TechCorp Solutions',
  },
  {
    id: '4',
    type: 'order_created',
    description: 'Purchase order #PO-2024-001 created',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    entityName: 'PO-2024-001',
  },
];

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isLoading, setIsLoading] = useState(false);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep only last 20 activities
  }, []);

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
      
      // Add the product to the products array
      setProducts(prev => [newProduct, ...prev]);
      
      // Update the supplier's product count if a supplier is associated
      if (productData.supplier) {
        setSuppliers(prev => prev.map(supplier => {
          if (supplier.id === productData.supplier) {
            console.log(`Updating supplier ${supplier.name} product count from ${supplier.products} to ${supplier.products + 1}`);
            return {
              ...supplier,
              products: supplier.products + 1
            };
          }
          return supplier;
        }));
      }
      
      // Add activity
      addActivity({
        type: 'product_added',
        description: `Added new product "${newProduct.name}"`,
        entityName: newProduct.name,
      });
      
      toast.success('Product added successfully!');
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const updateProduct = useCallback(async (id: string, productData: Partial<Product>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let productName = '';
      setProducts(prev => prev.map(product => {
        if (product.id === id) {
          productName = product.name;
          const updated = { ...product, ...productData };
          // Update status based on stock
          if (productData.stock !== undefined || productData.lowStockThreshold !== undefined) {
            updated.status = updated.stock === 0 ? 'out_of_stock' : 
                            updated.stock <= updated.lowStockThreshold ? 'low_stock' : 'active';
          }
          return updated;
        }
        return product;
      }));
      
      // Add activity
      const changes = [];
      if (productData.stock !== undefined) changes.push(`stock updated to ${productData.stock}`);
      if (productData.price !== undefined) changes.push(`price updated to $${productData.price}`);
      if (productData.name !== undefined) changes.push(`name updated to "${productData.name}"`);
      
      addActivity({
        type: 'product_updated',
        description: `Updated product "${productName}" - ${changes.join(', ')}`,
        entityName: productName,
      });
      
      toast.success('Product updated successfully!');
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const deleteProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const product = products.find(p => p.id === id);
      setProducts(prev => prev.filter(p => p.id !== id));
      
      // Update supplier product count
      if (product?.supplier) {
        setSuppliers(prev => prev.map(supplier => {
          if (supplier.id === product.supplier) {
            return { ...supplier, products: Math.max(0, supplier.products - 1) };
          }
          return supplier;
        }));
      }
      
      // Add activity
      if (product) {
        addActivity({
          type: 'product_deleted',
          description: `Deleted product "${product.name}"`,
          entityName: product.name,
        });
      }
      
      toast.success('Product deleted successfully!');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, addActivity]);

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
      
      // Add activity
      addActivity({
        type: 'supplier_added',
        description: `New supplier "${newSupplier.name}" added`,
        entityName: newSupplier.name,
      });
      
      toast.success('Supplier added successfully!');
    } catch (error) {
      toast.error('Failed to add supplier. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const updateSupplier = useCallback(async (id: string, supplierData: Partial<Supplier>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let supplierName = '';
      setSuppliers(prev => prev.map(supplier => {
        if (supplier.id === id) {
          supplierName = supplier.name;
          return { ...supplier, ...supplierData };
        }
        return supplier;
      }));
      
      // Add activity
      addActivity({
        type: 'supplier_updated',
        description: `Updated supplier "${supplierName}"`,
        entityName: supplierName,
      });
      
      toast.success('Supplier updated successfully!');
    } catch (error) {
      console.error('Failed to update supplier:', error);
      toast.error('Failed to update supplier. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const deleteSupplier = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if supplier has products
      const hasProducts = products.some(p => p.supplier === id);
      if (hasProducts) {
        toast.error('Cannot delete supplier with associated products.');
        return;
      }
      
      const supplier = suppliers.find(s => s.id === id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
      
      // Add activity
      if (supplier) {
        addActivity({
          type: 'supplier_deleted',
          description: `Deleted supplier "${supplier.name}"`,
          entityName: supplier.name,
        });
      }
      
      toast.success('Supplier deleted successfully!');
    } catch (error) {
      console.error('Failed to delete supplier:', error);
      toast.error('Failed to delete supplier. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, suppliers, addActivity]);

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
      
      // Add activity
      addActivity({
        type: 'category_added',
        description: `New category "${newCategory.name}" added`,
        entityName: newCategory.name,
      });
      
      toast.success('Category added successfully!');
    } catch (error) {
      toast.error('Failed to add category. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const updateCategory = useCallback(async (id: string, categoryData: Partial<Category>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let categoryName = '';
      setCategories(prev => prev.map(category => {
        if (category.id === id) {
          categoryName = category.name;
          return { ...category, ...categoryData };
        }
        return category;
      }));
      
      // Add activity
      addActivity({
        type: 'category_updated',
        description: `Updated category "${categoryName}"`,
        entityName: categoryName,
      });
      
      toast.success('Category updated successfully!');
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error('Failed to update category. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const deleteCategory = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if category has products
      const hasProducts = products.some(p => p.category === id);
      if (hasProducts) {
        toast.error('Cannot delete category with associated products.');
        return;
      }
      
      const category = categories.find(c => c.id === id);
      setCategories(prev => prev.filter(c => c.id !== id));
      
      // Add activity
      if (category) {
        addActivity({
          type: 'category_deleted',
          description: `Deleted category "${category.name}"`,
          entityName: category.name,
        });
      }
      
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, categories, addActivity]);

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
      
      // Add activity
      addActivity({
        type: 'location_added',
        description: `New location "${newLocation.name}" added`,
        entityName: newLocation.name,
      });
      
      toast.success('Location added successfully!');
    } catch (error) {
      toast.error('Failed to add location. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const updateLocation = useCallback(async (id: string, locationData: Partial<Location>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let locationName = '';
      setLocations(prev => prev.map(location => {
        if (location.id === id) {
          locationName = location.name;
          return { ...location, ...locationData };
        }
        return location;
      }));
      
      // Add activity
      addActivity({
        type: 'location_updated',
        description: `Updated location "${locationName}"`,
        entityName: locationName,
      });
      
      toast.success('Location updated successfully!');
    } catch (error) {
      console.error('Failed to update location:', error);
      toast.error('Failed to update location. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const deleteLocation = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const location = locations.find(l => l.id === id);
      setLocations(prev => prev.filter(l => l.id !== id));
      
      // Add activity
      if (location) {
        addActivity({
          type: 'location_deleted',
          description: `Deleted location "${location.name}"`,
          entityName: location.name,
        });
      }
      
      toast.success('Location deleted successfully!');
    } catch (error) {
      console.error('Failed to delete location:', error);
      toast.error('Failed to delete location. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [locations, addActivity]);

  const addUser = useCallback(async (userData: Omit<User, 'id' | 'status'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        status: 'active'
      };
      
      setUsers(prev => [newUser, ...prev]);
      
      // Add activity
      addActivity({
        type: 'user_added',
        description: `New user "${newUser.name}" added`,
        entityName: newUser.name,
      });
      
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Failed to add user:', error);
      toast.error('Failed to add user. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let userName = '';
      setUsers(prev => prev.map(user => {
        if (user.id === id) {
          userName = user.name;
          return { ...user, ...userData };
        }
        return user;
      }));
      
      // Add activity
      addActivity({
        type: 'user_updated',
        description: `Updated user "${userName}"`,
        entityName: userName,
      });
      
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update user. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const deleteUser = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = users.find(u => u.id === id);
      setUsers(prev => prev.filter(u => u.id !== id));
      
      // Add activity
      if (user) {
        addActivity({
          type: 'user_deleted',
          description: `Deleted user "${user.name}"`,
          entityName: user.name,
        });
      }
      
      toast.success('User deleted successfully!');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [users, addActivity]);

  const addOrder = useCallback(async (orderData: Omit<Order, 'id'>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString()
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Add activity
      addActivity({
        type: 'order_created',
        description: `Purchase order "${newOrder.orderNumber}" created`,
        entityName: newOrder.orderNumber,
      });
      
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Failed to create order:', error);
      toast.error('Failed to create order. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const updateOrder = useCallback(async (id: string, orderData: Partial<Order>) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let orderNumber = '';
      setOrders(prev => prev.map(order => {
        if (order.id === id) {
          orderNumber = order.orderNumber;
          return { ...order, ...orderData };
        }
        return order;
      }));
      
      // Add activity
      const changes = [];
      if (orderData.status !== undefined) changes.push(`status updated to ${orderData.status}`);
      if (orderData.totalAmount !== undefined) changes.push(`amount updated to $${orderData.totalAmount}`);
      
      addActivity({
        type: 'order_updated',
        description: `Updated order "${orderNumber}" - ${changes.join(', ')}`,
        entityName: orderNumber,
      });
      
      toast.success('Order updated successfully!');
    } catch (error) {
      console.error('Failed to update order:', error);
      toast.error('Failed to update order. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const deleteOrder = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const order = orders.find(o => o.id === id);
      setOrders(prev => prev.filter(o => o.id !== id));
      
      // Add activity
      if (order) {
        addActivity({
          type: 'order_deleted',
          description: `Deleted order "${order.orderNumber}"`,
          entityName: order.orderNumber,
        });
      }
      
      toast.success('Order deleted successfully!');
    } catch (error) {
      console.error('Failed to delete order:', error);
      toast.error('Failed to delete order. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [orders, addActivity]);

  const sendEmail = useCallback(async (to: string, subject: string, message: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Email sent to ${to}: ${subject}`);
      
      // Add activity
      addActivity({
        type: 'email_sent',
        description: `Email sent to ${to}: "${subject}"`,
        entityName: to,
      });
      
      toast.success(`Email sent successfully to ${to}!`);
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error('Failed to send email. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addActivity]);

  const exportData = useCallback(async (type: 'products' | 'suppliers' | 'categories' | 'orders', format: 'csv' | 'pdf') => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let data: any[] = [];
      switch (type) {
        case 'products': data = products; break;
        case 'suppliers': data = suppliers; break;
        case 'categories': data = categories; break;
        case 'orders': data = orders; break;
      }
      
      // Simulate file download
      const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      console.log(`Exporting ${data.length} ${type} records to ${filename}`);
      
      // Add activity
      addActivity({
        type: 'data_exported',
        description: `Exported ${data.length} ${type} records as ${format.toUpperCase()}`,
        entityName: `${type}_export.${format}`,
      });
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [products, suppliers, categories, orders, addActivity]);

  const value: AppDataContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    suppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    users,
    addUser,
    updateUser,
    deleteUser,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    activities,
    sendEmail,
    exportData,
    isLoading,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};
