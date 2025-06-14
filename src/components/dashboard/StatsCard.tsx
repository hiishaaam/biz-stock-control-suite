
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  alert?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, trendUp, alert }) => {
  return (
    <Card className={`${alert ? 'border-orange-200 bg-orange-50' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${
            alert ? 'bg-orange-100' : 'bg-blue-100'
          }`}>
            <Icon className={`w-6 h-6 ${
              alert ? 'text-orange-600' : 'text-blue-600'
            }`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
