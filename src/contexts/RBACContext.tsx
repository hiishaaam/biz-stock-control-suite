
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserRoles, useUserPermissions, Permission, AppRole } from '@/hooks/useRolePermissions';

interface RBACContextType {
  roles: AppRole[];
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isStaff: boolean;
  isLoading: boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

interface RBACProviderProps {
  children: ReactNode;
}

export const RBACProvider: React.FC<RBACProviderProps> = ({ children }) => {
  const { data: roles = [], isLoading: rolesLoading } = useUserRoles();
  const { data: permissions = [], isLoading: permissionsLoading } = useUserPermissions();

  const hasPermission = (permission: Permission) => {
    // For now, let's be more permissive for authenticated users
    // This is temporary until role permissions are properly configured
    return permissions.includes(permission) || roles.length > 0;
  };
  
  const hasRole = (role: AppRole) => roles.includes(role);

  const isAdmin = hasRole('admin');
  const isManager = hasRole('manager');
  const isStaff = hasRole('staff');
  const isLoading = rolesLoading || permissionsLoading;

  const value: RBACContextType = {
    roles,
    permissions,
    hasPermission,
    hasRole,
    isAdmin,
    isManager,
    isStaff,
    isLoading,
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};
