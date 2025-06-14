
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, User } from 'lucide-react';

const SupplierTable = () => {
  const suppliers = [
    {
      id: 1,
      name: 'Apple Inc.',
      contact: 'John Smith',
      email: 'orders@apple.com',
      phone: '+1-800-275-2273',
      address: 'One Apple Park Way, Cupertino, CA',
      products: 23,
      totalOrders: 156,
      status: 'active',
    },
    {
      id: 2,
      name: 'Nike Sports',
      contact: 'Sarah Johnson',
      email: 'supply@nike.com',
      phone: '+1-503-671-6453',
      address: 'One Bowerman Drive, Beaverton, OR',
      products: 45,
      totalOrders: 89,
      status: 'active',
    },
    {
      id: 3,
      name: 'Samsung Electronics',
      contact: 'Kim Lee',
      email: 'b2b@samsung.com',
      phone: '+82-2-2255-0114',
      address: 'Seoul, South Korea',
      products: 67,
      totalOrders: 234,
      status: 'active',
    },
    {
      id: 4,
      name: 'Coffee Corp',
      contact: 'Maria Garcia',
      email: 'wholesale@coffeecorp.com',
      phone: '+1-555-123-4567',
      address: 'Portland, OR',
      products: 12,
      totalOrders: 45,
      status: 'inactive',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-900">Supplier</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Contact Info</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Products</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Orders</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
            <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{supplier.name}</p>
                    <p className="text-sm text-gray-500">{supplier.contact}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{supplier.email}</span>
                  </div>
                  <p className="text-sm text-gray-600">{supplier.phone}</p>
                  <p className="text-sm text-gray-500">{supplier.address}</p>
                </div>
              </td>
              <td className="py-4 px-4 text-gray-900 font-medium">{supplier.products}</td>
              <td className="py-4 px-4 text-gray-900 font-medium">{supplier.totalOrders}</td>
              <td className="py-4 px-4">
                <Badge 
                  className={supplier.status === 'active' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }
                >
                  {supplier.status}
                </Badge>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;
