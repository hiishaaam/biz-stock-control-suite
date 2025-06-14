
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Package, Trash2 } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseDataContext';
import EditCategoryDialog from './EditCategoryDialog';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';

const CategoryGrid = () => {
  const { categories, deleteCategory } = useSupabaseAppData();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await deleteCategory(id);
    setDeletingCategory(null);
  };

  // Calculate product count for each category (placeholder for now)
  const getProductCount = (categoryId: string) => {
    // This will be calculated from actual products once we implement the relationship
    return Math.floor(Math.random() * 50) + 1;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {getProductCount(category.id)} products
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingCategory(category.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setDeletingCategory(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {category.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {category.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {editingCategory && (
        <EditCategoryDialog 
          categoryId={editingCategory}
          open={!!editingCategory}
          onOpenChange={() => setEditingCategory(null)}
        />
      )}

      {deletingCategory && (
        <DeleteConfirmDialog
          open={!!deletingCategory}
          onOpenChange={() => setDeletingCategory(null)}
          onConfirm={() => handleDelete(deletingCategory)}
          title="Delete Category"
          description="Are you sure you want to delete this category? This action cannot be undone."
        />
      )}
    </>
  );
};

export default CategoryGrid;
