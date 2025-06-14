
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertTriangle, TrendingUp } from 'lucide-react';
import StockOverview from './StockOverview';
import LocationManager from './LocationManager';

const InventoryPage = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Track stock levels and manage inventory across locations.</p>
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">2,847</p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-orange-600">Low Stock</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-900 mt-1 sm:mt-2">23</p>
              </div>
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-green-600">Total Value</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1 sm:mt-2">$1.2M</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0 ml-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Overview */}
      <StockOverview />
      
      {/* Location Manager */}
      <LocationManager />
    </div>
  );
};

export default InventoryPage;
