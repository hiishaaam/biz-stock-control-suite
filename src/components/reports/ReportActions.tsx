
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Calendar } from 'lucide-react';

const ReportActions = () => {
  const reportTypes = [
    {
      title: 'Inventory Summary',
      description: 'Complete overview of current stock levels and values',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Sales Report',
      description: 'Detailed sales performance and trends analysis',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Stock Movement',
      description: 'Track inventory movements in and out of locations',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Low Stock Alert',
      description: 'Items requiring immediate attention and reordering',
      icon: Download,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportActions;
