
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package } from 'lucide-react';

const TopProducts = () => {
  const topProducts = [
    {
      name: 'iPhone 15 Pro',
      category: 'Electronics',
      sold: 145,
      revenue: '$144,855',
      trend: '+23%',
      trendUp: true,
    },
    {
      name: 'Nike Air Max 90',
      category: 'Footwear',
      sold: 89,
      revenue: '$11,571',
      trend: '+12%',
      trendUp: true,
    },
    {
      name: 'MacBook Pro 16"',
      category: 'Electronics',
      sold: 34,
      revenue: '$84,966',
      trend: '+8%',
      trendUp: true,
    },
    {
      name: 'Coffee Beans Premium',
      category: 'Food & Beverage',
      sold: 234,
      revenue: '$5,847',
      trend: '-5%',
      trendUp: false,
    },
    {
      name: 'Wireless Headphones',
      category: 'Electronics',
      sold: 67,
      revenue: '$13,399',
      trend: '+18%',
      trendUp: true,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Top Selling Products</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{product.revenue}</span>
                  <Badge className={`${
                    product.trendUp 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.trend}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{product.sold} sold</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProducts;
