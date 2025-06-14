
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateTransferStockReport,
  generateStockCountReport,
  generateLocationReport,
  generateHistoryReport
} from '@/utils/locationReportGenerator';

interface LocationExportActionsProps {
  location: {
    id: string;
    name: string;
    address: string;
    type: string;
    products: number;
    value: string;
    status: string;
  };
}

const LocationExportActions: React.FC<LocationExportActionsProps> = ({ location }) => {
  const [exportingAction, setExportingAction] = useState<string | null>(null);
  const { toast } = useToast();

  const handleExport = async (actionType: string, format: 'csv' | 'pdf') => {
    setExportingAction(actionType);
    
    try {
      let filename = '';
      
      if (format === 'pdf') {
        let doc;
        switch (actionType) {
          case 'transfer-stock':
            doc = generateTransferStockReport(location);
            filename = `transfer-stock-${location.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            break;
          case 'stock-count':
            doc = generateStockCountReport(location);
            filename = `stock-count-${location.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            break;
          case 'generate-report':
            doc = generateLocationReport(location);
            filename = `location-report-${location.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            break;
          case 'view-history':
            doc = generateHistoryReport(location);
            filename = `history-${location.name.toLowerCase().replace(/\s+/g, '-')}.pdf`;
            break;
          default:
            throw new Error('Unknown action type');
        }
        
        doc.save(filename);
      } else {
        // CSV format
        let csvContent = '';
        switch (actionType) {
          case 'transfer-stock':
            csvContent = generateTransferStockCSV(location);
            filename = `transfer-stock-${location.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
            break;
          case 'stock-count':
            csvContent = generateStockCountCSV(location);
            filename = `stock-count-${location.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
            break;
          case 'generate-report':
            csvContent = generateLocationCSV(location);
            filename = `location-report-${location.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
            break;
          case 'view-history':
            csvContent = generateHistoryCSV(location);
            filename = `history-${location.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
            break;
          default:
            throw new Error('Unknown action type');
        }
        
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
        description: `${getActionDisplayName(actionType)} exported successfully as ${format.toUpperCase()}!`,
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
      setExportingAction(null);
    }
  };

  const getActionDisplayName = (actionType: string) => {
    switch (actionType) {
      case 'transfer-stock': return 'Transfer Stock Report';
      case 'stock-count': return 'Stock Count Report';
      case 'generate-report': return 'Location Report';
      case 'view-history': return 'History Report';
      default: return 'Report';
    }
  };

  const quickActions = [
    { id: 'transfer-stock', label: 'Transfer Stock', description: 'Export stock transfer records' },
    { id: 'stock-count', label: 'Stock Count', description: 'Export current stock count data' },
    { id: 'generate-report', label: 'Generate Report', description: 'Export comprehensive location report' },
    { id: 'view-history', label: 'View History', description: 'Export location activity history' },
  ];

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Quick Actions</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const isExporting = exportingAction === action.id;
          
          return (
            <div key={action.id} className="flex flex-col space-y-2">
              <Button variant="outline" size="sm" disabled={isExporting}>
                {action.label}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    disabled={isExporting}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    {isExporting ? 'Exporting...' : 'Export'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport(action.id, 'csv')}>
                    <Table className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport(action.id, 'pdf')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// CSV generation functions
const generateTransferStockCSV = (location: any) => {
  let csvContent = 'Transfer Date,Product Name,SKU,Quantity,From Location,To Location,Status\n';
  
  // Sample transfer data
  const transfers = [
    { date: '2024-06-10', product: 'iPhone 15 Pro', sku: 'IP15P-001', quantity: 25, from: location.name, to: 'Store A', status: 'Completed' },
    { date: '2024-06-11', product: 'MacBook Pro 16"', sku: 'MBP16-001', quantity: 5, from: 'Store B', to: location.name, status: 'Pending' },
    { date: '2024-06-12', product: 'Wireless Headphones', sku: 'WH-001', quantity: 50, from: location.name, to: 'Store B', status: 'Completed' },
  ];
  
  transfers.forEach(transfer => {
    csvContent += `"${transfer.date}","${transfer.product}","${transfer.sku}",${transfer.quantity},"${transfer.from}","${transfer.to}","${transfer.status}"\n`;
  });
  
  return csvContent;
};

const generateStockCountCSV = (location: any) => {
  let csvContent = 'Product Name,SKU,Expected Quantity,Actual Quantity,Variance,Last Count Date\n';
  
  // Sample stock count data
  const stockCounts = [
    { product: 'iPhone 15 Pro', sku: 'IP15P-001', expected: 45, actual: 43, variance: -2, lastCount: '2024-06-13' },
    { product: 'MacBook Pro 16"', sku: 'MBP16-001', expected: 12, actual: 12, variance: 0, lastCount: '2024-06-13' },
    { product: 'Wireless Headphones', sku: 'WH-001', expected: 156, actual: 158, variance: 2, lastCount: '2024-06-13' },
  ];
  
  stockCounts.forEach(count => {
    csvContent += `"${count.product}","${count.sku}",${count.expected},${count.actual},${count.variance},"${count.lastCount}"\n`;
  });
  
  return csvContent;
};

const generateLocationCSV = (location: any) => {
  let csvContent = 'Location Name,Address,Type,Total Products,Total Value,Status\n';
  csvContent += `"${location.name}","${location.address}","${location.type}",${location.products},"${location.value}","${location.status}"\n`;
  return csvContent;
};

const generateHistoryCSV = (location: any) => {
  let csvContent = 'Date,Activity Type,Description,User,Details\n';
  
  // Sample history data
  const history = [
    { date: '2024-06-13 10:30', type: 'Stock Update', description: 'Stock adjusted for iPhone 15 Pro', user: 'John Doe', details: 'Quantity changed from 45 to 43' },
    { date: '2024-06-12 14:20', type: 'Transfer', description: 'Stock transferred to Store B', user: 'Jane Smith', details: '50 units of Wireless Headphones' },
    { date: '2024-06-11 09:15', type: 'Receiving', description: 'New stock received', user: 'Mike Johnson', details: '25 units of iPhone 15 Pro' },
  ];
  
  history.forEach(item => {
    csvContent += `"${item.date}","${item.type}","${item.description}","${item.user}","${item.details}"\n`;
  });
  
  return csvContent;
};

export default LocationExportActions;
