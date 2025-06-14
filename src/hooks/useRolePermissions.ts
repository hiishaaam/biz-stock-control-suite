
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type AppRole = 'admin' | 'manager' | 'staff';
export type Permission = 
  | 'view_dashboard'
  | 'view_products' | 'create_products' | 'edit_products' | 'delete_products'
  | 'view_categories' | 'create_categories' | 'edit_categories' | 'delete_categories'
  | 'view_suppliers' | 'create_suppliers' | 'edit_suppliers' | 'delete_suppliers'
  | 'view_inventory' | 'manage_inventory' | 'view_locations' | 'manage_locations'
  | 'view_orders' | 'create_orders' | 'edit_orders' | 'delete_orders'
  | 'view_users' | 'create_users' | 'edit_users' | 'delete_users'
  | 'view_reports' | 'export_data'
  | 'manage_settings';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_by?: string;
  assigned_at?: string;
}

// Hook to get current user's roles
export const useUserRoles = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userRoles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .rpc('get_user_roles', { _user_id: user.id });
      
      if (error) throw error;
      return data as AppRole[];
    },
    enabled: !!user?.id,
  });
};

// Hook to get current user's permissions
export const useUserPermissions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .rpc('get_user_permissions', { _user_id: user.id });
      
      if (error) throw error;
      return data as Permission[];
    },
    enabled: !!user?.id,
  });
};

// Hook to check if user has specific permission
export const useHasPermission = (permission: Permission) => {
  const { data: permissions = [] } = useUserPermissions();
  return permissions.includes(permission);
};

// Hook to check if user has specific role
export const useHasRole = (role: AppRole) => {
  const { data: roles = [] } = useUserRoles();
  return roles.includes(role);
};

// Hook to assign role to user (admin only)
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role,
          assigned_by: user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Role assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to assign role: ${error.message}`);
    },
  });
};

// Hook to remove role from user (admin only)
export const useRemoveRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoles'] });
      toast.success('Role removed successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to remove role: ${error.message}`);
    },
  });
};

// Hook to get all user roles (for admin management)
export const useAllUserRoles = () => {
  return useQuery({
    queryKey: ['allUserRoles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles!user_roles_user_id_fkey(full_name, email)
        `)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
