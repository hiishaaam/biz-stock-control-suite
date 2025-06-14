
import React from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { Permission } from '@/hooks/useRolePermissions';

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission, isLoading } = useRBAC();

  if (isLoading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded"></div>;
  }

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
