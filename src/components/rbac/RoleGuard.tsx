
import React from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { AppRole } from '@/hooks/useRolePermissions';

interface RoleGuardProps {
  roles: AppRole | AppRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ 
  roles, 
  children, 
  fallback = null 
}) => {
  const { hasRole, isLoading } = useRBAC();

  if (isLoading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded"></div>;
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const hasRequiredRole = allowedRoles.some(role => hasRole(role));

  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RoleGuard;
