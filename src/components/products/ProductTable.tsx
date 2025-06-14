
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Archive, AlertTriangle, Trash2, QrCode } from 'lucide-react';
import { useProducts, useSuppliers, useCategories } from '@/hooks/useSupabaseQueries';
import { useDeleteProduct } from '@/hooks/useProductMutations';
import EditProductDialog from './EditProductDialog';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';
import CodeDisplayDialog from '../barcode/CodeDisplayDialog';
import type { Product } from '@/types/database';

interface ProductTableProps {
  searchTerm: string;
}

const ProductTable: React.FC<ProductTableProps> = ({ searchTerm }) => {
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: suppliers = [] } = useSuppliers();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [codeDisplayProduct, setCodeDisplayProduct] = useState<Product | null>(null);

  console.log('Products from Supabase:', products);
  console.log('Suppliers:', suppliers);
  console.log('Categories:', categories);

  const getSupplierName = (supplierId?: string | null) => {
    if (!supplierId) return 'No Supplier';
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  };

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.code && product.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    getCategoryName(product.category_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (product: Product) => {
    const stock = product.stock || 0;
    const threshold = product.low_stock_threshold || 10;
    
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (stock <= threshold) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Stock</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    await deleteProduct.mutateAsync(id);
    setDeletingProduct(null);
  };

  const handleShowCode = (product: Product) => {
    setCodeDisplayProduct(product);
  };

  if (productsLoading) {
    return <div className="p-4 text-center">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="p-4 text-center text-gray-500">No products found. Add your first product to get started!</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">SKU / Code</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Archive className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{getSupplierName(product.supplier_id)}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <p className="text-gray-600 font-mono text-sm">{product.sku}</p>
                    {product.code && (
                      <p className="text-xs text-blue-600 font-mono bg-blue-50 px-2 py-1 rounded">
                        {product.code}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{getCategoryName(product.category_id)}</td>
                <td className="py-4 px-4 text-gray-900 font-medium">${product.price}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{product.stock || 0}</span>
                    {(product.stock || 0) <= (product.low_stock_threshold || 10) && (product.stock || 0) > 0 && (
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">{getStatusBadge(product)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShowCode(product)}
                      title="Show Barcode/QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingProduct(product.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeletingProduct(product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <EditProductDialog 
          productId={editingProduct}
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <DeleteConfirmDialog
          open={!!deletingProduct}
          onOpenChange={() => setDeletingProduct(null)}
          onConfirm={() => handleDelete(deletingProduct)}
          title="Delete Product"
          description="Are you sure you want to delete this product? This action cannot be undone."
        />
      )}

      {codeDisplayProduct && (
        <CodeDisplayDialog
          open={!!codeDisplayProduct}
          onOpenChange={() => setCodeDisplayProduct(null)}
          productCode={codeDisplayProduct.code || codeDisplayProduct.sku}
          productName={codeDisplayProduct.name}
        />
      )}
    </>
  );
};

export default ProductTable;
