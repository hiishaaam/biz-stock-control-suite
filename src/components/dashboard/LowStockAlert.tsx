
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LowStockAlert = () => {
  const lowStockItems = [
    { name: 'iPhone 13 Pro', category: 'Electronics', stock: 3, threshold: 10 },
    { name: 'Nike Air Max', category: 'Footwear', stock: 2, threshold: 5 },
    { name: 'Coffee Beans Premium', category: 'Food', stock: 1, threshold: 8 },
    { name: 'Laptop Stand', category: 'Accessories', stock: 4, threshold: 12 },
  ];

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
        <Button className="w-full mt-3 sm:mt-4 bg-orange-600 hover:bg-orange-700 text-sm sm:text-base">
          Reorder All Low Stock Items
        </Button>
      </CardContent>
    </Card>
  );
};

export default LowStockAlert;
