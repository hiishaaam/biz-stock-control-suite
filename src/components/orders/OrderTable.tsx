
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, ShoppingCart, Trash2, Eye, Cog } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import EditOrderDialog from './EditOrderDialog';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';
import ProcessOrderDialog from './ProcessOrderDialog';

interface OrderTableProps {
  searchTerm: string;
}

const OrderTable: React.FC<OrderTableProps> = ({ searchTerm }) => {
  const { orders, suppliers, sendEmail, deleteOrder } = useAppData();
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Unknown Supplier';
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSupplierName(order.supplier).toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      shipped: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      delivered: 'bg-green-100 text-green-800 hover:bg-green-200',
      cancelled: 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  const handleSendEmail = async (order: any) => {
    const supplier = suppliers.find(s => s.id === order.supplier);
    if (supplier) {
      await sendEmail(
        supplier.email, 
        `Order Update - ${order.orderNumber}`, 
        `Your order ${order.orderNumber} has been updated. Total amount: $${order.totalAmount}`
      );
    }
  };

  const handleDelete = async (id: string) => {
    await deleteOrder(id);
    setDeletingOrder(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Order</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Items</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Total</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Order Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.orderNumber}</p>
                      {order.expectedDelivery && (
                        <p className="text-sm text-gray-500">
                          Expected: {new Date(order.expectedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{getSupplierName(order.supplier)}</td>
                <td className="py-4 px-4 text-gray-900 font-medium">{order.items.length}</td>
                <td className="py-4 px-4 text-gray-900 font-medium">${order.totalAmount.toLocaleString()}</td>
                <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                <td className="py-4 px-4 text-gray-600 text-sm">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingOrder(order.id)}
                      title="Edit Order"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {order.status === 'confirmed' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setProcessingOrder(order.id)}
                        title="Process Order"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Cog className="w-4 h-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSendEmail(order)}
                      title="Send Email to Supplier"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeletingOrder(order.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete Order"
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

      {editingOrder && (
        <EditOrderDialog 
          orderId={editingOrder}
          open={!!editingOrder}
          onOpenChange={() => setEditingOrder(null)}
        />
      )}

      {deletingOrder && (
        <DeleteConfirmDialog
          open={!!deletingOrder}
          onOpenChange={() => setDeletingOrder(null)}
          onConfirm={() => handleDelete(deletingOrder)}
          title="Delete Order"
          description="Are you sure you want to delete this order? This action cannot be undone."
        />
      )}

      {processingOrder && (
        <ProcessOrderDialog
          open={!!processingOrder}
          onOpenChange={() => setProcessingOrder(null)}
          orderId={processingOrder}
        />
      )}
    </>
  );
};

export default OrderTable;
