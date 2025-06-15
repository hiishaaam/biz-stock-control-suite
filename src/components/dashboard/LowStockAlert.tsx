
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAppData } from '@/contexts/SupabaseDataContext';

const LowStockAlert = () => {
  const { sendEmail, suppliers, products } = useSupabaseAppData();
  
  // Calculate low stock items from actual products data
  const lowStockItems = products.filter(product => 
    product.stock <= product.low_stock_threshold
  ).map(product => ({
    name: product.name,
    category: product.category_id || 'Unknown',
    stock: product.stock,
    threshold: product.low_stock_threshold,
    supplierId: product.supplier_id
  }));

  const handleReorderAll = async () => {
    try {
      // Group items by supplier
      const itemsBySupplier = lowStockItems.reduce((acc, item) => {
        if (!acc[item.supplierId]) {
          acc[item.supplierId] = [];
        }
        acc[item.supplierId].push(item);
        return acc;
      }, {} as Record<string, typeof lowStockItems>);

      // Send email to each supplier
      for (const [supplierId, items] of Object.entries(itemsBySupplier)) {
        const supplier = suppliers.find(s => s.id === supplierId);
        if (supplier) {
          const itemsList = items.map(item => 
            `- ${item.name} (Current: ${item.stock}, Minimum: ${item.threshold})`
          ).join('\n');

          const subject = 'Urgent: Restock Request for Low Inventory Items';
          const message = `Dear ${supplier.contact || supplier.name},

We hope this message finds you well. We are writing to request immediate restocking of the following items that have fallen below our minimum inventory levels:

${itemsList}

Please arrange for expedited delivery of these items to ensure we can continue serving our customers without interruption.

Order Details Needed:
- Estimated delivery time
- Quantity available for immediate shipment
- Updated pricing if applicable

Please confirm receipt of this request and provide an estimated delivery schedule at your earliest convenience.

Thank you for your continued partnership.

Best regards,
Inventory Management Team`;

          await sendEmail(supplier.email, subject, message);
        }
      }
    } catch (error) {
      // Error handling is done in the context
      console.error('Failed to send restock emails:', error);
    }
  };

  // Show message if no low stock items
  if (lowStockItems.length === 0) {
    return (
      <Card className="border-green-200">
        <CardHeader className="pb-2 sm:pb-6">
          <CardTitle className="flex items-center space-x-2 text-green-700 text-lg sm:text-xl">
            <Package className="w-5 h-5" />
            <span>Stock Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-green-700 font-medium">All items are well stocked!</p>
            <p className="text-green-600 text-sm mt-1">No low stock alerts at this time.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="flex items-center space-x-2 text-orange-700 text-lg sm:text-xl">
          <AlertTriangle className="w-5 h-5" />
          <span>Low Stock Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="max-h-64 sm:max-h-80 overflow-y-auto space-y-3">
          {lowStockItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{item.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{item.category}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-bold text-orange-600 text-sm sm:text-base">{item.stock} left</p>
                <p className="text-xs text-gray-500">Min: {item.threshold}</p>
              </div>
            </div>
          ))}
        </div>
        <Button 
          className="w-full mt-3 sm:mt-4 bg-orange-600 hover:bg-orange-700 text-sm sm:text-base"
          onClick={handleReorderAll}
        >
          Reorder All Low Stock Items
        </Button>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
