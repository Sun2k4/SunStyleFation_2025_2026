export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null
          id: number
          quantity: number | null
          user_id: string | null
          variant_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          quantity?: number | null
          user_id?: string | null
          variant_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          quantity?: number | null
          user_id?: string | null
          variant_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: number
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: number
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: number
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          price_at_purchase: number
          product_id: number
          quantity: number | null
          variant_id: number | null
        }
        Insert: {
          id?: number
          order_id: number
          price_at_purchase: number
          product_id: number
          quantity?: number | null
          variant_id?: number | null
        }
        Update: {
          id?: number
          order_id?: number
          price_at_purchase?: number
          product_id?: number
          quantity?: number | null
          variant_id?: number | null
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
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          notes: string | null
          payment_method: string | null
          shipping_address_id: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_number: string | null
          user_id: string
          coupon_code: string | null
          discount_amount: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          notes?: string | null
          payment_method?: string | null
          shipping_address_id?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_number?: string | null
          user_id: string
          coupon_code?: string | null
          discount_amount?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          notes?: string | null
          payment_method?: string | null
          shipping_address_id?: number | null
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          tracking_number?: string | null
          user_id?: string
          coupon_code?: string | null
          discount_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: number
          image_url: string
          product_id: number
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: number
          image_url: string
          product_id: number
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: number
          image_url?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string
          id: number
          price_adjustment: number | null
          product_id: number
          size: string
          sku: string | null
          stock_quantity: number | null
        }
        Insert: {
          color: string
          id?: number
          price_adjustment?: number | null
          product_id: number
          size: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Update: {
          color?: string
          id?: number
          price_adjustment?: number | null
          product_id?: number
          size?: string
          sku?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: number | null
          created_at: string
          description: string | null
          id: number
          image_url: string | null
          name: string
          price: number
          stock_quantity: number | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name: string
          price: number
          stock_quantity?: number | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          image_url?: string | null
          name?: string
          price?: number
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone_number: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: number
          product_id: number | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: number
          product_id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: number
          product_id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_addresses: {
        Row: {
          address_line: string
          city: string
          created_at: string
          district: string | null
          id: number
          is_default: boolean | null
          phone_number: string
          recipient_name: string
          user_id: string
        }
        Insert: {
          address_line: string
          city: string
          created_at?: string
          district?: string | null
          id?: number
          is_default?: boolean | null
          phone_number: string
          recipient_name: string
          user_id: string
        }
        Update: {
          address_line?: string
          city?: string
          created_at?: string
          district?: string | null
          id?: number
          is_default?: boolean | null
          phone_number?: string
          recipient_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          id: number
          code: string
          discount_type: string
          discount_value: number
          min_order_amount: number | null
          max_discount: number | null
          usage_limit: number | null
          used_count: number | null
          start_date: string | null
          end_date: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: number
          code: string
          discount_type: string
          discount_value: number
          min_order_amount?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          used_count?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          discount_type?: string
          discount_value?: number
          min_order_amount?: number | null
          max_discount?: number | null
          usage_limit?: number | null
          used_count?: number | null
          start_date?: string | null
          end_date?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_stock: {
        Args: { p_quantity: number; p_variant_id: number }
        Returns: boolean
      }
      delete_user_by_admin: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      increment_stock: {
        Args: { p_quantity: number; p_variant_id: number }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      validate_coupon: {
        Args: { p_code: string; p_order_total: number }
        Returns: Json
      }
      use_coupon: {
        Args: { p_code: string }
        Returns: undefined
      }
    }
    Enums: {
      order_status:
      | "pending"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled"
      payment_method_enum: "cod" | "credit_card" | "bank_transfer" | "e_wallet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_method_enum: ["cod", "credit_card", "bank_transfer", "e_wallet"],
    },
  },
} as const
