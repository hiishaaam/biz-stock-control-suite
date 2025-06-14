
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Archive, Package } from 'lucide-react';

const CategoryGrid = () => {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Smartphones, laptops, tablets, and electronic accessories',
      productCount: 145,
      color: 'bg-blue-100 text-blue-800',
      icon: Package,
    },
    {
      id: 2,
      name: 'Clothing',
      description: 'Fashion and apparel for all ages',
      productCount: 98,
      color: 'bg-purple-100 text-purple-800',
      icon: Archive,
    },
    {
      id: 3,
      name: 'Books',
      description: 'Fiction, non-fiction, educational, and reference books',
      productCount: 234,
      color: 'bg-green-100 text-green-800',
      icon: Package,
    },
    {
      id: 4,
      name: 'Home & Garden',
      description: 'Home improvement, furniture, and gardening supplies',
      productCount: 87,
      color: 'bg-orange-100 text-orange-800',
      icon: Archive,
    },
    {
      id: 5,
      name: 'Sports',
      description: 'Sports equipment, fitness gear, and outdoor activities',
      productCount: 156,
      color: 'bg-red-100 text-red-800',
      icon: Package,
    },
    {
      id: 6,
      name: 'Food & Beverage',
      description: 'Groceries, snacks, beverages, and specialty foods',
      productCount: 67,
      color: 'bg-yellow-100 text-yellow-800',
      icon: Archive,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <div
            key={category.id}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${category.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                  <Icon className={`w-5 h-5 ${category.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Archive className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge className={category.color}>
                {category.productCount} Products
              </Badge>
              <Button variant="outline" size="sm">
                View Products
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
