
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface StockMovement {
  id: string;
  product_id: string;
  movement_type: 'in' | 'out' | 'adjustment' | 'reserved' | 'released';
  quantity: number;
  reference_type: 'order' | 'adjustment' | 'initial' | 'return' | null;
  reference_id: string | null;
  reason: string | null;
  previous_stock: number;
  new_stock: number;
  created_by: string | null;
  created_at: string;
}

export const useStockMovements = (productId?: string) => {
  return useQuery({
    queryKey: ['stock-movements', productId],
    queryFn: async () => {
      let query = supabase
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Stock movements error:', error);
        throw new Error(`Failed to fetch stock movements: ${error.message}`);
      }

      return data as StockMovement[];
    },
  });
};
