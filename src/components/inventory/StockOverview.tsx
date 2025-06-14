
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, AlertTriangle, Edit } from 'lucide-react';

const StockOverview = () => {
  const stockItems = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      sku: 'IPH15P-256-TB',
      location: 'Main Warehouse',
      current: 45,
      reserved: 5,
      available: 40,
      threshold: 10,
      status: 'good',
    },
    {
      id: 2,
      name: 'Nike Air Max 90',
      sku: 'NAM90-BLK-42',
      location: 'Store A',
      current: 3,
      reserved: 1,
      available: 2,
      threshold: 5,
      status: 'low',
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      sku: 'MBP16-512-SG',
      location: 'Main Warehouse',
      current: 12,
      reserved: 2,
      available: 10,
      threshold: 8,
      status: 'good',
    },
    {
      id: 4,
      name: 'Coffee Beans Premium',
      sku: 'CFB-PREM-1KG',
      location: 'Store B',
      current: 0,
      reserved: 0,
      available: 0,
      threshold: 20,
      status: 'out',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'low':
        return <Badge className="bg-orange-100 text-orange-800">Low Stock</Badge>;
      case 'out':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Stock Overview by Location</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Current</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reserved</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Available</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500 font-mono">{item.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.location}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{item.current}</span>
                      {item.current <= item.threshold && item.current > 0 && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{item.reserved}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{item.available}</td>
                  <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockOverview;
