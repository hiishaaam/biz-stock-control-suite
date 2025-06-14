
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppData } from '@/contexts/AppDataContext';
import { Loader2 } from 'lucide-react';

interface EditOrderDialogProps {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditOrderDialog: React.FC<EditOrderDialogProps> = ({ orderId, open, onOpenChange }) => {
  const { orders, updateOrder, isLoading } = useAppData();
  const [status, setStatus] = useState('');

  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateOrder(orderId, { status: status as any });
      onOpenChange(false);
    } catch (error) {
      // Error is handled in the context
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Order - {order.orderNumber}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Order Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Order Details</h4>
            <p className="text-sm text-gray-600">Total Amount: ${order.totalAmount.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Items: {order.items.length}</p>
            <p className="text-sm text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating Order...
                </>
              ) : (
                'Update Order'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
