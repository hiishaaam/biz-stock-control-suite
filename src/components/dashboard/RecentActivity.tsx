
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User, Archive, CheckCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      type: 'product_added',
      description: 'Added new product "Samsung Galaxy S24"',
      time: '2 hours ago',
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      type: 'stock_updated',
      description: 'Updated stock for "Nike Air Jordan" - Added 50 units',
      time: '4 hours ago',
      icon: Archive,
      color: 'text-green-600 bg-green-100',
    },
    {
      type: 'supplier_added',
      description: 'New supplier "TechCorp Solutions" added',
      time: '6 hours ago',
      icon: User,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      type: 'order_completed',
      description: 'Purchase order #PO-2024-001 completed',
      time: '8 hours ago',
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-100',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
