
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Package, AlertTriangle } from 'lucide-react';
import { useProcessOrder, type ProcessOrderItem } from '@/hooks/useOrderProcessing';
import { useSupabaseAppData } from '@/contexts/SupabaseDataContext';
import InsufficientStockAlert from './InsufficientStockAlert';

interface ProcessOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
}

const ProcessOrderDialog: React.FC<ProcessOrderDialogProps> = ({ 
  open, 
  onOpenChange, 
  orderId 
}) => {
  const { orders, products } = useSupabaseAppData();
  const processOrder = useProcessOrder();
  const [insufficientItems, setInsufficientItems] = useState<any[]>([]);

  const order = orders.find(o => o.id === orderId);

  const handleProcessOrder = async () => {
    if (!order || !order.items || order.items.length === 0) {
      console.error('Order or order items not found');
      return;
    }

    try {
      setInsufficientItems([]);
      
      const orderItems: ProcessOrderItem[] = order.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      }));

      const result = await processOrder.mutateAsync({
        order_id: order.id,
        items: orderItems
      });

      if (result.success) {
        onOpenChange(false);
      } else if (result.insufficient_items) {
        setInsufficientItems(result.insufficient_items);
      }
    } catch (error) {
      console.error('Error processing order:', error);
    }
  };

  if (!order) return null;

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Process Order - {order.order_number}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Number:</span>
                <span className="font-medium">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">${order.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium capitalize">{order.status}</span>
              </div>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Items to Process</h3>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium">Product</th>
                      <th className="text-left p-3 text-sm font-medium">Quantity</th>
                      <th className="text-left p-3 text-sm font-medium">Price</th>
                      <th className="text-left p-3 text-sm font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-3">{getProductName(item.productId)}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">${item.price.toFixed(2)}</td>
                        <td className="p-3">${(item.price * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {insufficientItems.length > 0 && (
            <InsufficientStockAlert 
              items={insufficientItems} 
              onClose={() => setInsufficientItems([])}
            />
          )}

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">Processing Order</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This will reduce stock levels for all items in this order. 
                  Make sure you have sufficient inventory before proceeding.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={processOrder.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProcessOrder}
              disabled={processOrder.isPending || order.status !== 'confirmed' || !order.items || order.items.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processOrder.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Order'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProcessOrderDialog;
