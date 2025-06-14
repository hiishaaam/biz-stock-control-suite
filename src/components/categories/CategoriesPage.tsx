
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Archive } from 'lucide-react';
import CategoryGrid from './CategoryGrid';
import AddCategoryDialog from './AddCategoryDialog';

const CategoriesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">Organize your products with categories.</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Archive className="w-5 h-5" />
            <span>Product Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryGrid />
        </CardContent>
      </Card>

      <AddCategoryDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};

export default CategoriesPage;
