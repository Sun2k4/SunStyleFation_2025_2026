export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  phoneNumber?: string;
  gender?: string;
}

// Maps to 'products' table
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string; // Frontend uses 'image', mapped from 'image_url'
  images?: string[];
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  stock: number; // Frontend uses 'stock', mapped from 'stock_quantity'
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Maps to 'orders' table
export interface Order {
  id: number;
  userId: string;
  date: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items?: OrderItem[];
  // Extended info for Admin UI
  userInfo?: {
    name: string;
    email: string;
  };
}

// Maps to 'order_items' table
export interface OrderItem {
  id?: number;
  orderId: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  product?: Product; // For display purposes
}

// Maps to 'user_addresses' table
export interface Address {
  id?: number;
  user_id: string;
  recipient_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  district: string;
  is_default: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
