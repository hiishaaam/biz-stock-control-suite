
import React, { createContext, useContext } from 'react';
import { 
  useCategories, 
  useSuppliers, 
  useProducts, 
  useLocations, 
  useUsers, 
  useOrders, 
  useActivities,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useCreateActivity,
  Category,
  Supplier,
  Product,
  Location,
  User,
  Order,
  Activity
} from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface SupabaseDataContextType {
  // Data
  categories: Category[];
  suppliers: Supplier[];
  products: Product[];
  locations: Location[];
  users: User[];
  orders: Order[];
  activities: Activity[];
  
  // Loading states
  isLoading: boolean;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Supplier operations
  addSupplier: (supplier: Omit<Supplier, 'id' | 'products' | 'totalOrders' | 'status'>) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  
  // Product operations
  addProduct: (product: Omit<Product, 'id' | 'status'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Utility functions
  sendEmail: (to: string, subject: string, message: string) => Promise<void>;
  exportData: (type: 'products' | 'suppliers' | 'categories' | 'orders', format: 'csv' | 'pdf') => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const useSupabaseAppData = () => {
  const context = useContext(SupabaseDataContext);
  if (!context) {
    throw new Error('useSupabaseAppData must be used within a SupabaseDataProvider');
  }
  return context;
};

export const SupabaseDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Queries
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: suppliers = [], isLoading: suppliersLoading } = useSuppliers();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: locations = [], isLoading: locationsLoading } = useLocations();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: orders = [], isLoading: ordersLoading } = useOrders();
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  
  const createSupplier = useCreateSupplier();
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();
  
  const createProduct = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  
  const createActivity = useCreateActivity();

  const isLoading = categoriesLoading || suppliersLoading || productsLoading || 
                   locationsLoading || usersLoading || ordersLoading || activitiesLoading;

  // Wrapper functions to match the original AppDataContext interface
  const addCategory = async (category: Omit<Category, 'id'>) => {
    await createCategory.mutateAsync(category);
    createActivity.mutate({
      type: 'category_added',
      description: `Added new category "${category.name}"`,
    });
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    await updateCategoryMutation.mutateAsync({ id, ...category });
    createActivity.mutate({
      type: 'category_updated',
      description: `Updated category "${category.name || 'Unknown'}"`,
    });
  };

  const deleteCategory = async (id: string) => {
    const category = categories.find(c => c.id === id);
    await deleteCategoryMutation.mutateAsync(id);
    if (category) {
      createActivity.mutate({
        type: 'category_deleted',
        description: `Deleted category "${category.name}"`,
      });
    }
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id' | 'products' | 'totalOrders' | 'status'>) => {
    await createSupplier.mutateAsync(supplier);
    createActivity.mutate({
      type: 'supplier_added',
      description: `Added new supplier "${supplier.name}"`,
    });
  };

  const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
    await updateSupplierMutation.mutateAsync({ id, ...supplier });
    createActivity.mutate({
      type: 'supplier_updated',
      description: `Updated supplier "${supplier.name || 'Unknown'}"`,
    });
  };

  const deleteSupplier = async (id: string) => {
    const supplier = suppliers.find(s => s.id === id);
    await deleteSupplierMutation.mutateAsync(id);
    if (supplier) {
      createActivity.mutate({
        type: 'supplier_deleted',
        description: `Deleted supplier "${supplier.name}"`,
      });
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'status'>) => {
    await createProduct.mutateAsync(product);
    createActivity.mutate({
      type: 'product_added',
      description: `Added new product "${product.name}"`,
    });
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    await updateProductMutation.mutateAsync({ id, ...product });
    createActivity.mutate({
      type: 'product_updated',
      description: `Updated product "${product.name || 'Unknown'}"`,
    });
  };

  const deleteProduct = async (id: string) => {
    const product = products.find(p => p.id === id);
    await deleteProductMutation.mutateAsync(id);
    if (product) {
      createActivity.mutate({
        type: 'product_deleted',
        description: `Deleted product "${product.name}"`,
      });
    }
  };

  const sendEmail = async (to: string, subject: string, message: string) => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`Email sent to ${to}: ${subject}`);
    
    createActivity.mutate({
      type: 'email_sent',
      description: `Email sent to ${to}: "${subject}"`,
    });
    
    toast.success(`Email sent successfully to ${to}!`);
  };

  const exportData = async (type: 'products' | 'suppliers' | 'categories' | 'orders', format: 'csv' | 'pdf') => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let dataCount = 0;
    switch (type) {
      case 'products': dataCount = products.length; break;
      case 'suppliers': dataCount = suppliers.length; break;
      case 'categories': dataCount = categories.length; break;
      case 'orders': dataCount = orders.length; break;
    }
    
    const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.${format}`;
    console.log(`Exporting ${dataCount} ${type} records to ${filename}`);
    
    createActivity.mutate({
      type: 'data_exported',
      description: `Exported ${dataCount} ${type} records as ${format.toUpperCase()}`,
    });
    
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} exported successfully as ${format.toUpperCase()}!`);
  };

  const value: SupabaseDataContextType = {
    categories,
    suppliers,
    products,
    locations,
    users,
    orders,
    activities,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addProduct,
    updateProduct,
    deleteProduct,
    sendEmail,
    exportData,
  };

  return <SupabaseDataContext.Provider value={value}>{children}</SupabaseDataContext.Provider>;
};
