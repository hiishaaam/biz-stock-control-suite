
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Archive } from 'lucide-react';
import CategoryGrid from './CategoryGrid';
import AddCategoryDialog from './AddCategoryDialog';
import PermissionGuard from '@/components/rbac/PermissionGuard';

const CategoriesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Organize your products with categories.</p>
        </div>
        <PermissionGuard 
          permission="create_categories"
          fallback={
            <Button 
              disabled
              className="bg-gray-400 cursor-not-allowed w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category (No Permission)
            </Button>
          }
        >
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </PermissionGuard>
      </div>

      <PermissionGuard 
        permission="view_categories"
        fallback={
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="text-center">
                <Archive className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">You don't have permission to view categories.</p>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Archive className="w-5 h-5" />
              <span>Product Categories</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryGrid />
          </CardContent>
        </Card>
      </PermissionGuard>

      <PermissionGuard permission="create_categories">
        <AddCategoryDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen} 
        />
      </PermissionGuard>
    </div>
  );
};

export default CategoriesPage;
