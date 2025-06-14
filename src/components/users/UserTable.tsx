
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Mail, User, Trash2 } from 'lucide-react';
import { useAppData } from '@/contexts/AppDataContext';
import EditUserDialog from './EditUserDialog';
import DeleteConfirmDialog from '../shared/DeleteConfirmDialog';

interface UserTableProps {
  searchTerm: string;
}

const UserTable: React.FC<UserTableProps> = ({ searchTerm }) => {
  const { users, sendEmail, deleteUser } = useAppData();
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800 hover:bg-red-200',
      manager: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      employee: 'bg-green-100 text-green-800 hover:bg-green-200',
    };
    return <Badge className={colors[role as keyof typeof colors]}>{role}</Badge>;
  };

  const handleSendEmail = async (email: string, name: string) => {
    await sendEmail(email, 'System Notification', `Hello ${name}, this is a system notification.`);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setDeletingUser(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{user.email}</td>
                <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
                <td className="py-4 px-4 text-gray-600">{user.department || '-'}</td>
                <td className="py-4 px-4">
                  <Badge 
                    className={user.status === 'active' 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="py-4 px-4 text-gray-600 text-sm">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingUser(user.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleSendEmail(user.email, user.name)}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setDeletingUser(user.id)}
                      className="text-red-600 hover:text-red-700"
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

      {editingUser && (
        <EditUserDialog 
          userId={editingUser}
          open={!!editingUser}
          onOpenChange={() => setEditingUser(null)}
        />
      )}

      {deletingUser && (
        <DeleteConfirmDialog
          open={!!deletingUser}
          onOpenChange={() => setDeletingUser(null)}
          onConfirm={() => handleDelete(deletingUser)}
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
        />
      )}
    </>
  );
};

export default UserTable;
