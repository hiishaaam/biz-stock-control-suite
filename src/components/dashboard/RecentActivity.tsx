
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, User, Archive, CheckCircle, Mail, Download, Edit, Trash2, Plus } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = () => {
  const { activities } = useAppData();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'product_added':
      case 'product_updated':
      case 'product_deleted':
        return Package;
      case 'stock_updated':
        return Archive;
      case 'supplier_added':
      case 'supplier_updated':
      case 'supplier_deleted':
      case 'user_added':
      case 'user_updated':
      case 'user_deleted':
        return User;
      case 'order_created':
      case 'order_updated':
      case 'order_deleted':
        return CheckCircle;
      case 'email_sent':
        return Mail;
      case 'data_exported':
        return Download;
      case 'category_added':
      case 'category_updated':
      case 'category_deleted':
      case 'location_added':
      case 'location_updated':
      case 'location_deleted':
        return Edit;
      default:
        return Package;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'product_added':
      case 'supplier_added':
      case 'user_added':
      case 'order_created':
      case 'category_added':
      case 'location_added':
        return 'text-green-600 bg-green-100';
      case 'product_updated':
      case 'supplier_updated':
      case 'user_updated':
      case 'order_updated':
      case 'category_updated':
      case 'location_updated':
      case 'stock_updated':
        return 'text-blue-600 bg-blue-100';
      case 'product_deleted':
      case 'supplier_deleted':
      case 'user_deleted':
      case 'order_deleted':
      case 'category_deleted':
      case 'location_deleted':
        return 'text-red-600 bg-red-100';
      case 'email_sent':
        return 'text-purple-600 bg-purple-100';
      case 'data_exported':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No recent activity</p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              const colorClass = getActivityColor(activity.type);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full flex-shrink-0 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{activity.description}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
