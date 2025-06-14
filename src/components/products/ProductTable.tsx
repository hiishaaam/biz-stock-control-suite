
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Archive, AlertTriangle } from 'lucide-react';

interface ProductTableProps {
  searchTerm: string;
}

const ProductTable: React.FC<ProductTableProps> = ({ searchTerm }) => {
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      sku: 'IPH15P-256-TB',
      category: 'Electronics',
      price: 999.99,
      stock: 45,
      lowStockThreshold: 10,
      supplier: 'Apple Inc.',
      status: 'active',
    },
    {
      id: 2,
      name: 'Nike Air Max 90',
      sku: 'NAM90-BLK-42',
      category: 'Footwear',
      price: 129.99,
      stock: 3,
      lowStockThreshold: 5,
      supplier: 'Nike Sports',
      status: 'low_stock',
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      sku: 'MBP16-512-SG',
      category: 'Electronics',
      price: 2499.99,
      stock: 12,
      lowStockThreshold: 8,
      supplier: 'Apple Inc.',
      status: 'active',
    },
    {
      id: 4,
      name: 'Coffee Beans Premium',
      sku: 'CFB-PREM-1KG',
      category: 'Food & Beverage',
      price: 24.99,
      stock: 0,
      lowStockThreshold: 20,
      supplier: 'Coffee Corp',
      status: 'out_of_stock',
    },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (product: any) => {
    if (product.stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (product.stock <= product.lowStockThreshold) {
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">Low Stock</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">In Stock</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
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
                    <p className="text-sm text-gray-500">{product.supplier}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-600 font-mono text-sm">{product.sku}</td>
              <td className="py-4 px-4 text-gray-600">{product.category}</td>
              <td className="py-4 px-4 text-gray-900 font-medium">${product.price}</td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{product.stock}</span>
                  {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </td>
              <td className="py-4 px-4">{getStatusBadge(product)}</td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
