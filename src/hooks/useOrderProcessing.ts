
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface OrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface ProcessOrderRequest {
  order_id: string;
  items: OrderItem[];
}

export interface StockUpdate {
  product_id: string;
  previous_stock: number;
  new_stock: number;
  quantity_reduced: number;
}

export interface ProcessOrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  insufficient_items?: Array<{
    product_id: string;
    product_name?: string;
    requested: number;
    available: number;
    error: string;
  }>;
  stock_updates?: StockUpdate[];
}

export const useProcessOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ order_id, items }: ProcessOrderRequest): Promise<ProcessOrderResponse> => {
      console.log('Processing order:', order_id, 'with items:', items);

      const { data, error } = await supabase.rpc('process_order_with_stock_reduction', {
        p_order_id: order_id,
        p_order_items: items
      });

      if (error) {
        console.error('Order processing error:', error);
        throw new Error(`Failed to process order: ${error.message}`);
      }

      console.log('Order processing result:', data);
      return data as ProcessOrderResponse;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Order processed successfully!');
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['products'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      } else {
        toast.error(data.error || 'Failed to process order');
      }
    },
    onError: (error: Error) => {
      console.error('Order processing mutation error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    },
  });
};

export const useLowStockProducts = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('get_low_stock_products');
      
      if (error) {
        console.error('Low stock products error:', error);
        throw new Error(`Failed to fetch low stock products: ${error.message}`);
      }

      return data;
    },
  });
};
