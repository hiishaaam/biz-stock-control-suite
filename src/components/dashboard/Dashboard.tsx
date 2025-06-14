
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Archive, User, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import InventoryChart from './InventoryChart';
import LowStockAlert from './LowStockAlert';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Products',
      value: '1,247',
      icon: Package,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Low Stock Items',
      value: '23',
      icon: AlertTriangle,
      trend: '-8%',
      trendUp: false,
      alert: true,
    },
    {
      title: 'Total Suppliers',
      value: '45',
      icon: User,
      trend: '+3%',
      trendUp: true,
    },
    {
      title: 'Total Value',
      value: '$125,430',
      icon: TrendingUp,
      trend: '+18%',
      trendUp: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your inventory.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryChart />
        <LowStockAlert />
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
};

export default Dashboard;
