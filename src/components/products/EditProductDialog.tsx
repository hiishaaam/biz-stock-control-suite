import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useProducts, useSuppliers, useCategories } from '@/hooks/useSupabaseQueries';
import { useUpdateProduct } from '@/hooks/useProductMutations';
import { Loader2, QrCode } from 'lucide-react';
import CodeDisplayDialog from '../barcode/CodeDisplayDialog';

interface EditProductDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ productId, open, onOpenChange }) => {
  const { data: products = [] } = useProducts();
  const { data: suppliers = [] } = useSuppliers();
  const { data: categories = [] } = useCategories();
  const updateProduct = useUpdateProduct();
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    code: '',
    category_id: '',
    cost: '',
    price: '',
    stock: '',
    low_stock_threshold: '',
    supplier_id: '',
    description: '',
  });

  const [showCodeDialog, setShowCodeDialog] = useState(false);

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (product) {
      console.log('EditProductDialog - Product found:', product);
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        code: product.code || '',
        category_id: product.category_id || '',
        cost: product.cost?.toString() || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '0',
        low_stock_threshold: product.low_stock_threshold?.toString() || '10',
        supplier_id: product.supplier_id || '',
        description: product.description || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('EditProductDialog - Submitting form:', formData);
    
    try {
      const updateData = {
        id: productId,
        name: formData.name.trim(),
        sku: formData.sku.trim(),
        code: formData.code.trim() || null,
        category_id: formData.category_id || null,
        supplier_id: formData.supplier_id || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        low_stock_threshold: parseInt(formData.low_stock_threshold) || 10,
        description: formData.description.trim() || null,
      };

      console.log('EditProductDialog - Update data:', updateData);
      
      await updateProduct.mutateAsync(updateData);
      onOpenChange(false);
    } catch (error) {
      console.error('EditProductDialog - Error updating product:', error);
    }
  };

  const generateCode = () => {
    const generatedCode = `PRD-${formData.sku || Date.now()}`;
    setFormData({ ...formData, code: generatedCode });
  };

  if (!product) {
    console.log('EditProductDialog - Product not found for ID:', productId);
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Enter SKU"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Product Code (Barcode/QR)</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter or generate product code"
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  Generate
                </Button>
                {formData.code && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCodeDialog(true)}
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Unique code for barcode/QR code generation and scanning
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier_id">Supplier</Label>
                <Select value={formData.supplier_id} onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500">What you paid for this product</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-500">What you sell this product for</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock Level</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
                <Input
                  id="low_stock_threshold"
                  type="number"
                  min="0"
                  value={formData.low_stock_threshold}
                  onChange={(e) => setFormData({ ...formData, low_stock_threshold: e.target.value })}
                  placeholder="10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateProduct.isPending}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={updateProduct.isPending}>
                {updateProduct.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Product...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showCodeDialog && formData.code && (
        <CodeDisplayDialog
          open={showCodeDialog}
          onOpenChange={setShowCodeDialog}
          productCode={formData.code}
          productName={formData.name}
        />
      )}
    </>
  );
};

export default EditProductDialog;
