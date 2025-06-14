
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, User } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';

const SupplierTable = () => {
  const { suppliers } = useAppData();

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
                    {supplier.contact && <p className="text-sm text-gray-500">{supplier.contact}</p>}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{supplier.email}</span>
                  </div>
                  {supplier.phone && <p className="text-sm text-gray-600">{supplier.phone}</p>}
                  {supplier.address && <p className="text-sm text-gray-500">{supplier.address}</p>}
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
