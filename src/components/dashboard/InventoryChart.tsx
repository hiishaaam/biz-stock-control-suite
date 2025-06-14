
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
      <CardHeader className="pb-2 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Inventory by Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={10}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis fontSize={10} />
              <Tooltip 
                contentStyle={{ 
                  fontSize: '12px',
                  backgroundColor: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" name="Total Items" />
              <Bar dataKey="stock" fill="#10b981" name="In Stock" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryChart;
