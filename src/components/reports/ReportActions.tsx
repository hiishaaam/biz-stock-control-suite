
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, BarChart3, Calendar, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateInventoryReport, 
  generateSalesReport, 
  generateStockMovementReport, 
  generateLowStockReport,
  generateCSVReport 
} from '@/utils/reportGenerator';

const ReportActions = () => {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const { toast } = useToast();

  const reportTypes = [
    {
      id: 'inventory',
      title: 'Inventory Summary',
      description: 'Complete overview of current stock levels and values',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Detailed sales performance and trends analysis',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'movement',
      title: 'Stock Movement',
      description: 'Track inventory movements in and out of locations',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'lowstock',
      title: 'Low Stock Alert',
      description: 'Items requiring immediate attention and reordering',
      icon: Download,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const handleGenerateReport = async (reportId: string, format: 'pdf' | 'csv') => {
    setGeneratingReport(reportId);
    
    try {
      let doc;
      let filename = '';
      
      if (format === 'pdf') {
        switch (reportId) {
          case 'inventory':
            doc = generateInventoryReport([]);
            filename = 'inventory-summary.pdf';
            break;
          case 'sales':
            doc = generateSalesReport();
            filename = 'sales-report.pdf';
            break;
          case 'movement':
            doc = generateStockMovementReport();
            filename = 'stock-movement.pdf';
            break;
          case 'lowstock':
            doc = generateLowStockReport();
            filename = 'low-stock-alert.pdf';
            break;
          default:
            throw new Error('Unknown report type');
        }
        
        doc.save(filename);
      } else {
        // CSV format
        const csvContent = generateCSVReport(reportId, []);
        const reportName = reportTypes.find(r => r.id === reportId)?.title || 'Report';
        filename = `${reportName.toLowerCase().replace(/\s+/g, '-')}.csv`;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      toast({
        title: "Report Generated",
        description: `${reportTypes.find(r => r.id === reportId)?.title} has been downloaded successfully.`,
      });
      
      console.log(`Generated ${format.toUpperCase()} report: ${filename}`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            const isGenerating = generatingReport === report.id;
            
            return (
              <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-medium text-gray-900">{report.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      disabled={isGenerating}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleGenerateReport(report.id, 'pdf')}>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleGenerateReport(report.id, 'csv')}>
                      <Table className="w-4 h-4 mr-2" />
                      Generate CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportActions;
