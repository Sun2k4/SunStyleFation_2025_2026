import { Tables } from './supabase';

export type UserRole = "user" | "admin";

// Category inherits from auto-generated types
export interface Category extends Tables<'categories'> {
  productCount?: number; // Display field only
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  gender?: string;
}

// Product inherits from auto-generated types
export interface Product extends Omit<Tables<'products'>, 'image_url' | 'stock_quantity'> {
  // Mapped fields for frontend compatibility
  image: string; // Mapped from 'image_url'
  images?: string[];
  stock: number; // Mapped from 'stock_quantity'

  // Display fields populated via joins
  categoryName?: string;
  slug?: string;

  // Nested relations
  variants?: ProductVariant[];
  reviewsList?: Review[];

  // Legacy fields for compatibility
  rating?: number;
  reviews?: number;
  isNew?: boolean;
}

// Product variant inherits from auto-generated types
export interface ProductVariant extends Tables<'product_variants'> {
  // Inherits: id, product_id, size, color, stock_quantity, sku, price_adjustment
}

// Review inherits from auto-generated types
export interface Review extends Tables<'reviews'> {
  // Inherits: id, product_id, user_id, rating, comment, created_at
  userName?: string; // Display field populated via join
  userAvatar?: string;
}

// Cart item now tracks variant instead of just product
export interface CartItem {
  id?: number;
  user_id?: string;
  variant_id: number;
  quantity: number;

  // For display purposes (populated via joins)
  product?: Product;
  variant?: ProductVariant;
}

// Order inherits from auto-generated types with proper ENUM status
export interface Order extends Omit<Tables<'orders'>, 'user_id' | 'created_at'> {
  userId: string; // Mapped from user_id for frontend compatibility
  date: string; // Mapped from created_at
  total: number; // Mapped from total_amount
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  // Nested relations
  items?: OrderItem[];

  // Extended info for Admin UI
  userInfo?: {
    name: string;
    email: string;
  };
}

// Order item inherits from auto-generated types
export interface OrderItem extends Omit<Tables<'order_items'>, 'order_id' | 'product_id' | 'price_at_purchase'> {
  orderId: number; // Mapped from order_id
  productId: number; // Mapped from product_id
  priceAtPurchase: number; // Mapped from price_at_purchase

  // For display purposes
  product?: Product;
  variant?: ProductVariant;
}

// User address inherits from auto-generated types
export interface Address extends Tables<'user_addresses'> {
  // Inherits all fields from database
}

// Coupon inherits from auto-generated types
export interface Coupon extends Tables<'coupons'> {
  // Inherits: id, code, discount_type, discount_value, min_order_amount, max_discount,
  //           usage_limit, used_count, start_date, end_date, is_active, created_at
}

export interface CouponValidationResult {
  valid: boolean;
  error?: string;
  discount?: number;
  discount_type?: string;
  discount_value?: number;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
