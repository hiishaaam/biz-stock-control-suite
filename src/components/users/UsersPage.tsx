
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Users } from 'lucide-react';
import UserTable from './UserTable';
import AddUserDialog from './AddUserDialog';
import PermissionGuard from '@/components/rbac/PermissionGuard';
import RoleManagement from '@/components/rbac/RoleManagement';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage user accounts and permissions.</p>
        </div>
        <PermissionGuard permission="create_users">
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </PermissionGuard>
      </div>

      <PermissionGuard permission="view_users">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Users className="w-5 h-5" />
                <span>User Directory</span>
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <UserTable searchTerm={searchTerm} />
          </CardContent>
        </Card>
      </PermissionGuard>

      <PermissionGuard permission="edit_users">
        <RoleManagement />
      </PermissionGuard>

      <PermissionGuard permission="create_users">
        <AddUserDialog 
          open={isAddDialogOpen} 
          onOpenChange={setIsAddDialogOpen} 
        />
      </PermissionGuard>
    </div>
  );
};

export default UsersPage;
