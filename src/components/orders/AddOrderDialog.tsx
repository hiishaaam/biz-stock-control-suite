
import React, { useState } from 'react';
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
import { useAppData } from '@/contexts/AppDataContext';
import { Loader2 } from 'lucide-react';

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ open, onOpenChange }) => {
  const { addOrder, suppliers, products, isLoading } = useAppData();
  const [formData, setFormData] = useState({
    orderNumber: '',
    supplier: '',
    selectedProducts: [] as { productId: string; quantity: number; price: number }[],
    expectedDelivery: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
    }
    if (!formData.supplier) {
      newErrors.supplier = 'Supplier is required';
    }
    if (formData.selectedProducts.length === 0) {
      newErrors.products = 'At least one product is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateTotal = () => {
    return formData.selectedProducts.reduce((total, item) => 
      total + (item.quantity * item.price), 0
    );
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      selectedProducts: [...formData.selectedProducts, { productId: '', quantity: 1, price: 0 }]
    });
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...formData.selectedProducts];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-fill price when product is selected
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product && product.cost) {
        updated[index].price = product.cost;
      }
    }
    
    setFormData({ ...formData, selectedProducts: updated });
  };

  const removeProduct = (index: number) => {
    const updated = formData.selectedProducts.filter((_, i) => i !== index);
    setFormData({ ...formData, selectedProducts: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await addOrder({
        orderNumber: formData.orderNumber.trim(),
        supplier: formData.supplier,
        items: formData.selectedProducts,
        totalAmount: calculateTotal(),
        status: 'pending',
        orderDate: new Date().toISOString(),
        expectedDelivery: formData.expectedDelivery || undefined,
        notes: formData.notes.trim() || undefined,
      });

      // Reset form and close dialog
      setFormData({
        orderNumber: '',
        supplier: '',
        selectedProducts: [],
        expectedDelivery: '',
        notes: '',
      });
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <Input
                id="orderNumber"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="e.g., ORD-2025-003"
                className={errors.orderNumber ? 'border-red-500' : ''}
              />
              {errors.orderNumber && <p className="text-sm text-red-500">{errors.orderNumber}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier *</Label>
              <Select value={formData.supplier} onValueChange={(value) => setFormData({ ...formData, supplier: value })}>
                <SelectTrigger className={errors.supplier ? 'border-red-500' : ''}>
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
              {errors.supplier && <p className="text-sm text-red-500">{errors.supplier}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDelivery">Expected Delivery</Label>
            <Input
              id="expectedDelivery"
              type="date"
              value={formData.expectedDelivery}
              onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Products *</Label>
              <Button type="button" onClick={addProduct} variant="outline" size="sm">
                Add Product
              </Button>
            </div>
            
            {formData.selectedProducts.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <Select 
                    value={item.productId} 
                    onValueChange={(value) => updateProduct(index, 'productId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateProduct(index, 'quantity', parseInt(e.target.value) || 1)}
                    placeholder="Qty"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.price}
                    onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            {errors.products && <p className="text-sm text-red-500">{errors.products}</p>}
            
            {formData.selectedProducts.length > 0 && (
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Total: ${calculateTotal().toLocaleString()}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter order notes"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Order...
                </>
              ) : (
                'Create Order'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderDialog;
