
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Package, Scan } from 'lucide-react';
import { useProducts } from '@/hooks/useSupabaseQueries';
import ProductTable from './ProductTable';
import AddProductDialog from './AddProductDialog';
import CodeScannerDialog from '../barcode/CodeScannerDialog';
import ExportButton from '../shared/ExportButton';
import { toast } from 'sonner';

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { data: products = [], isLoading } = useProducts();

  console.log('ProductsPage - Products count:', products.length);
  console.log('ProductsPage - Is loading:', isLoading);

  const handleCodeScanned = (code: string, product?: any) => {
    if (product) {
      setSearchTerm(product.name);
      toast.success(`Product found: ${product.name}`);
    } else {
      setSearchTerm(code);
      toast.info(`Searching for code: ${code}`);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage your product catalog and inventory levels. ({products.length} products)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            onClick={() => setIsScannerOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Scan className="w-4 h-4 mr-2" />
            Scan Code
          </Button>
          <ExportButton type="products" className="w-full sm:w-auto" />
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Package className="w-5 h-5" />
              <span>Product Catalog</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products, codes, SKUs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          <ProductTable searchTerm={searchTerm} />
        </CardContent>
      </Card>

      <AddProductDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />

      <CodeScannerDialog
        open={isScannerOpen}
        onOpenChange={setIsScannerOpen}
        onCodeScanned={handleCodeScanned}
      />
    </div>
  );
};

export default ProductsPage;
