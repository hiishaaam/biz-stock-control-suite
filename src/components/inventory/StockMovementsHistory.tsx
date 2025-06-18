
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStockMovements } from '@/hooks/useStockMovements';
import { History, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';

interface StockMovementsHistoryProps {
  productId?: string;
  title?: string;
}

const StockMovementsHistory: React.FC<StockMovementsHistoryProps> = ({ 
  productId, 
  title = "Stock Movement History" 
}) => {
  const { data: movements = [], isLoading } = useStockMovements(productId);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'out':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'adjustment':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      default:
        return <History className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMovementBadge = (type: string) => {
    const colors = {
      in: 'bg-green-100 text-green-800',
      out: 'bg-red-100 text-red-800',
      adjustment: 'bg-blue-100 text-blue-800',
      reserved: 'bg-yellow-100 text-yellow-800',
      released: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <Badge className={colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="w-5 h-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {movements.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No stock movements recorded</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {movements.map((movement) => (
              <div key={movement.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getMovementIcon(movement.movement_type)}
                    <div>
                      <div className="flex items-center space-x-2">
                        {getMovementBadge(movement.movement_type)}
                        <span className="font-medium">
                          {movement.movement_type === 'out' ? '-' : '+'}
                          {movement.quantity}
                        </span>
                      </div>
                      {movement.reason && (
                        <p className="text-sm text-gray-600 mt-1">{movement.reason}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-900">
                      {movement.previous_stock} → {movement.new_stock}
                    </div>
                    <div className="text-gray-500">
                      {new Date(movement.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                {movement.reference_type && (
                  <div className="mt-2 text-xs text-gray-500">
                    Reference: {movement.reference_type} 
                    {movement.reference_id && ` (${movement.reference_id.slice(0, 8)}...)`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockMovementsHistory;
