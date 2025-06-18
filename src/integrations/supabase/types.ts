export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          description: string
          id: string
          timestamp: string | null
          type: Database["public"]["Enums"]["activity_type"]
          user_id: string | null
        }
        Insert: {
          description: string
          id?: string
          timestamp?: string | null
          type: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Update: {
          description?: string
          id?: string
          timestamp?: string | null
          type?: Database["public"]["Enums"]["activity_type"]
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          capacity: number | null
          created_at: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["location_type"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          created_at?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["location_type"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          created_at?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["location_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          product_id: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          expected_delivery: string | null
          id: string
          order_date: string | null
          order_number: string
          status: Database["public"]["Enums"]["order_status"] | null
          supplier_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expected_delivery?: string | null
          id?: string
          order_date?: string | null
          order_number: string
          status?: Database["public"]["Enums"]["order_status"] | null
          supplier_id?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expected_delivery?: string | null
          id?: string
          order_date?: string | null
          order_number?: string
          status?: Database["public"]["Enums"]["order_status"] | null
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      password_reset_rate_limit: {
        Row: {
          email: string
          first_request_at: string
          id: string
          last_request_at: string
          request_count: number | null
        }
        Insert: {
          email: string
          first_request_at?: string
          id?: string
          last_request_at?: string
          request_count?: number | null
        }
        Update: {
          email?: string
          first_request_at?: string
          id?: string
          last_request_at?: string
          request_count?: number | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token_hash: string
          used: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          token_hash: string
          used?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token_hash?: string
          used?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string | null
          code: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          low_stock_threshold: number | null
          max_stock: number | null
          name: string
          price: number
          reorder_point: number | null
          reserved_stock: number | null
          sku: string
          stock: number | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          code?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          low_stock_threshold?: number | null
          max_stock?: number | null
          name: string
          price: number
          reorder_point?: number | null
          reserved_stock?: number | null
          sku: string
          stock?: number | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          code?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          low_stock_threshold?: number | null
          max_stock?: number | null
          name?: string
          price?: number
          reorder_point?: number | null
          reserved_stock?: number | null
          sku?: string
          stock?: number | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          id: string
          permission: Database["public"]["Enums"]["permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: string
          permission: Database["public"]["Enums"]["permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: string
          permission?: Database["public"]["Enums"]["permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          movement_type: string
          new_stock: number
          previous_stock: number
          product_id: string | null
          quantity: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type: string
          new_stock: number
          previous_stock: number
          product_id?: string | null
          quantity: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          movement_type?: string
          new_stock?: number
          previous_stock?: number
          product_id?: string | null
          quantity?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          products: number | null
          status: Database["public"]["Enums"]["supplier_status"] | null
          total_orders: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          products?: number | null
          status?: Database["public"]["Enums"]["supplier_status"] | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          products?: number | null
          status?: Database["public"]["Enums"]["supplier_status"] | null
          total_orders?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          department: string | null
          email: string
          id: string
          last_login: string | null
          name: string
          phone: string | null
          profile_id: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          last_login?: string | null
          name: string
          phone?: string | null
          profile_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          phone?: string | null
          profile_id?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_password_reset_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_low_stock_products: {
        Args: Record<PropertyKey, never>
        Returns: {
          product_id: string
          product_name: string
          current_stock: number
          threshold: number
          available_stock: number
        }[]
      }
      get_user_permissions: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["permission"][]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_permission: {
        Args: {
          _user_id: string
          _permission: Database["public"]["Enums"]["permission"]
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_order_with_stock_reduction: {
        Args: { p_order_id: string; p_order_items: Json }
        Returns: Json
      }
    }
    Enums: {
      activity_type:
        | "product_added"
        | "product_updated"
        | "product_deleted"
        | "supplier_added"
        | "supplier_updated"
        | "supplier_deleted"
        | "user_added"
        | "user_updated"
        | "user_deleted"
        | "order_created"
        | "order_updated"
        | "order_deleted"
        | "category_added"
        | "category_updated"
        | "category_deleted"
        | "location_added"
        | "location_updated"
        | "location_deleted"
        | "stock_updated"
        | "email_sent"
        | "data_exported"
      app_role: "admin" | "manager" | "staff"
      location_type: "warehouse" | "store" | "distribution"
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
      permission:
        | "view_dashboard"
        | "view_products"
        | "create_products"
        | "edit_products"
        | "delete_products"
        | "view_categories"
        | "create_categories"
        | "edit_categories"
        | "delete_categories"
        | "view_suppliers"
        | "create_suppliers"
        | "edit_suppliers"
        | "delete_suppliers"
        | "view_inventory"
        | "manage_inventory"
        | "view_locations"
        | "manage_locations"
        | "view_orders"
        | "create_orders"
        | "edit_orders"
        | "delete_orders"
        | "view_users"
        | "create_users"
        | "edit_users"
        | "delete_users"
        | "view_reports"
        | "export_data"
        | "manage_settings"
      supplier_status: "active" | "inactive"
      user_role: "admin" | "manager" | "employee"
      user_status: "active" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "product_added",
        "product_updated",
        "product_deleted",
        "supplier_added",
        "supplier_updated",
        "supplier_deleted",
        "user_added",
        "user_updated",
        "user_deleted",
        "order_created",
        "order_updated",
        "order_deleted",
        "category_added",
        "category_updated",
        "category_deleted",
        "location_added",
        "location_updated",
        "location_deleted",
        "stock_updated",
        "email_sent",
        "data_exported",
      ],
      app_role: ["admin", "manager", "staff"],
      location_type: ["warehouse", "store", "distribution"],
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      permission: [
        "view_dashboard",
        "view_products",
        "create_products",
        "edit_products",
        "delete_products",
        "view_categories",
        "create_categories",
        "edit_categories",
        "delete_categories",
        "view_suppliers",
        "create_suppliers",
        "edit_suppliers",
        "delete_suppliers",
        "view_inventory",
        "manage_inventory",
        "view_locations",
        "manage_locations",
        "view_orders",
        "create_orders",
        "edit_orders",
        "delete_orders",
        "view_users",
        "create_users",
        "edit_users",
        "delete_users",
        "view_reports",
        "export_data",
        "manage_settings",
      ],
      supplier_status: ["active", "inactive"],
      user_role: ["admin", "manager", "employee"],
      user_status: ["active", "inactive"],
    },
  },
} as const
