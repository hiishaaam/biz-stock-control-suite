
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseDataContext';
import { generateInventoryReport, generateCSVReport } from '@/utils/reportGenerator';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  type: 'products' | 'suppliers' | 'categories' | 'orders';
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ type, className = '' }) => {
  const { products, suppliers, categories, orders } = useSupabaseAppData();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    try {
      let filename = '';
      let data = [];
      
      // Get the correct data based on type
      switch (type) {
        case 'products':
          data = products;
          break;
        case 'suppliers':
          data = suppliers;
          break;
        case 'categories':
          data = categories;
          break;
        case 'orders':
          data = orders;
          break;
      }
      
      console.log(`Exporting ${data.length} ${type} records`);
      
      if (format === 'pdf') {
        const doc = generateInventoryReport(data);
        filename = `${type}_export_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
      } else {
        // CSV format - now passing the actual data
        const csvContent = generateCSVReport(type, data);
        filename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
        
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
        title: "Export Successful",
        description: `${data.length} ${type} exported successfully as ${format.toUpperCase()}!`,
      });
      
      console.log(`Generated ${format.toUpperCase()} export: ${filename}`);
      
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={className} disabled={isExporting}>
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <Table className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
