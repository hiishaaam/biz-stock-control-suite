
// Re-export everything from the new modular files for backward compatibility
export * from '@/types/database';
export * from './useSupabaseQueries';
export * from './useCategoryMutations';
export * from './useSupplierMutations';
export * from './useProductMutations';
export * from './useActivityMutations';

// Re-export order processing with renamed exports to avoid conflicts
export { 
  useProcessOrder, 
  useLowStockProducts,
  type ProcessOrderRequest,
  type ProcessOrderResponse,
  type StockUpdate,
  type ProcessOrderItem
} from './useOrderProcessing';

export * from './useStockMovements';
