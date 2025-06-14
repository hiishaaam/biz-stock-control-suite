
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <div
            key={category.id}
            className="p-4 sm:p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className={`p-1.5 sm:p-2 rounded-lg ${category.color.replace('text-', 'bg-').replace('-800', '-100')} flex-shrink-0`}>
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${category.color}`} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{category.name}</h3>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Archive className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{category.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge className={`${category.color} text-xs`}>
                {category.productCount} Products
              </Badge>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
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
