
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InventoryChart = () => {
  const data = [
    { name: 'Electronics', value: 145, stock: 85 },
    { name: 'Clothing', value: 98, stock: 72 },
    { name: 'Books', value: 234, stock: 95 },
    { name: 'Home & Garden', value: 87, stock: 45 },
    { name: 'Sports', value: 156, stock: 88 },
    { name: 'Toys', value: 67, stock: 34 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Inventory by Category</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" name="Total Items" />
            <Bar dataKey="stock" fill="#10b981" name="In Stock" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InventoryChart;
