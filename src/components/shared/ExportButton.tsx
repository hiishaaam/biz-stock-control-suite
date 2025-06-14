
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

interface ExportButtonProps {
  type: 'products' | 'suppliers' | 'categories' | 'orders';
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ type, className = '' }) => {
  const { exportData } = useAppData();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      await exportData(type, format);
    } catch (error) {
      console.error('Export failed:', error);
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
