
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Plus, Trash2 } from 'lucide-react';
import { useAllUserRoles, useAssignRole, useRemoveRole, AppRole } from '@/hooks/useRolePermissions';
import { useSupabaseAppData } from '@/contexts/SupabaseDataContext';

const RoleManagement = () => {
  const { data: userRoles = [], isLoading } = useAllUserRoles();
  const { users } = useSupabaseAppData();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('staff');

  const handleAssignRole = async () => {
    if (!selectedUser) return;
    
    await assignRole.mutateAsync({
      userId: selectedUser,
      role: selectedRole,
    });
    
    setSelectedUser('');
    setSelectedRole('staff');
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    await removeRole.mutateAsync({ userId, role });
  };

  const getRoleBadgeColor = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'staff':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Role Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Role Management</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Assign New Role */}
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-medium">Assign Role</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedRole} onValueChange={(value: AppRole) => setSelectedRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleAssignRole}
              disabled={!selectedUser || assignRole.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Assign Role
            </Button>
          </div>
        </div>

        {/* Current Role Assignments */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Role Assignments</h3>
          
          {userRoles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No role assignments found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {userRoles.map((userRole) => (
                <div key={`${userRole.user_id}-${userRole.role}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {userRole.profiles?.full_name || userRole.profiles?.email || 'Unknown User'}
                      </p>
                      <p className="text-sm text-gray-500">{userRole.profiles?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleBadgeColor(userRole.role)}>
                      {userRole.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRole(userRole.user_id, userRole.role)}
                      disabled={removeRole.isPending}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
