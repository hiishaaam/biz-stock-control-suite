
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Edit } from 'lucide-react';

const LocationManager = () => {
  const [selectedLocation, setSelectedLocation] = useState('main-warehouse');

  const locations = [
    {
      id: 'main-warehouse',
      name: 'Main Warehouse',
      address: '123 Industrial Blvd, City',
      type: 'Warehouse',
      products: 1247,
      value: '$845,230',
      status: 'active',
    },
    {
      id: 'store-a',
      name: 'Store A - Downtown',
      address: '456 Main St, Downtown',
      type: 'Retail',
      products: 342,
      value: '$125,430',
      status: 'active',
    },
    {
      id: 'store-b',
      name: 'Store B - Mall',
      address: '789 Mall Ave, Shopping Center',
      type: 'Retail',
      products: 198,
      value: '$89,650',
      status: 'active',
    },
    {
      id: 'backup-storage',
      name: 'Backup Storage',
      address: '321 Storage Way, Outskirts',
      type: 'Storage',
      products: 567,
      value: '$234,890',
      status: 'inactive',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Location Management</span>
          </CardTitle>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="font-medium text-gray-900 mb-3">Locations</h3>
            {locations.map((location) => (
              <div
                key={location.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedLocation === location.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedLocation(location.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{location.name}</h4>
                  <Badge 
                    className={location.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                    }
                  >
                    {location.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-1">{location.type}</p>
                <p className="text-sm text-gray-500">{location.address}</p>
              </div>
            ))}
          </div>

          {/* Location Details */}
          <div className="lg:col-span-2">
            {(() => {
              const location = locations.find(l => l.id === selectedLocation);
              if (!location) return null;

              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-gray-500">{location.address}</p>
                    </div>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Location
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{location.products}</p>
                          <p className="text-sm text-gray-500">Products</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{location.value}</p>
                          <p className="text-sm text-gray-500">Total Value</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{location.type}</p>
                          <p className="text-sm text-gray-500">Type</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Transfer Stock</Button>
                      <Button variant="outline" size="sm">Stock Count</Button>
                      <Button variant="outline" size="sm">Generate Report</Button>
                      <Button variant="outline" size="sm">View History</Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationManager;
