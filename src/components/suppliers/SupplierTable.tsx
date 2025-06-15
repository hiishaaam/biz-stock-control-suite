
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, Trash2 } from 'lucide-react';
import { useSupabaseAppData } from '@/contexts/SupabaseDataContext';
import EditSupplierDialog from './EditSupplierDialog';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';

const SupplierTable = () => {
  const { suppliers, sendEmail, deleteSupplier } = useSupabaseAppData();
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [deletingSupplierId, setDeletingSupplierId] = useState<string | null>(null);

  const handleSendEmail = async (supplier: any) => {
    try {
      await sendEmail(
        supplier.email,
        `Partnership Update from Your Business`,
        `Dear ${supplier.contact || supplier.name},\n\nWe hope this message finds you well. We wanted to reach out regarding our ongoing partnership.\n\nBest regards,\nYour Business Team`
      );
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleDeleteSupplier = async () => {
    if (deletingSupplierId) {
      try {
        await deleteSupplier(deletingSupplierId);
        setDeletingSupplierId(null);
      } catch (error) {
        // Error is handled in the context
      }
    }
  };

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No suppliers found. Add your first supplier to get started.</p>
      </div>
    );
  }

  return (
    <>
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
                      <Mail className="w-5 h-5 text-blue-600" />
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
                <td className="py-4 px-4 text-gray-900 font-medium">{supplier.products || 0}</td>
                <td className="py-4 px-4 text-gray-900 font-medium">{supplier.total_orders || 0}</td>
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingSupplierId(supplier.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSendEmail(supplier)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeletingSupplierId(supplier.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSupplierId && (
        <EditSupplierDialog
          supplierId={editingSupplierId}
          open={!!editingSupplierId}
          onOpenChange={(open) => !open && setEditingSupplierId(null)}
        />
      )}

      <DeleteConfirmDialog
        open={!!deletingSupplierId}
        onOpenChange={(open) => !open && setDeletingSupplierId(null)}
        onConfirm={handleDeleteSupplier}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </>
  );
};

export default SupplierTable;
