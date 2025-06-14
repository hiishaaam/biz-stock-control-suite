
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesChart = () => {
  const data = [
    { name: 'Jan', revenue: 4000, items: 240 },
    { name: 'Feb', revenue: 3000, items: 198 },
    { name: 'Mar', revenue: 5000, items: 310 },
    { name: 'Apr', revenue: 4500, items: 278 },
    { name: 'May', revenue: 6000, items: 365 },
    { name: 'Jun', revenue: 5500, items: 342 },
    { name: 'Jul', revenue: 7000, items: 425 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue ($)" />
            <Line type="monotone" dataKey="items" stroke="#10b981" strokeWidth={2} name="Items Sold" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
