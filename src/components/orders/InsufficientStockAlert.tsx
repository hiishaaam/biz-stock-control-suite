
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Package } from 'lucide-react';

interface InsufficientStockItem {
  product_id: string;
  product_name?: string;
  requested: number;
  available: number;
  error: string;
}

interface InsufficientStockAlertProps {
  items: InsufficientStockItem[];
  onClose?: () => void;
}

const InsufficientStockAlert: React.FC<InsufficientStockAlertProps> = ({ items, onClose }) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Insufficient Stock</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p>The following items don't have enough stock to fulfill this order:</p>
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <Package className="h-3 w-3" />
                <span className="font-medium">
                  {item.product_name || `Product ${item.product_id.slice(0, 8)}...`}:
                </span>
                <span>
                  Requested {item.requested}, Available {item.available}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-2 text-muted-foreground">
            Please reduce quantities or restock items before processing this order.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default InsufficientStockAlert;
