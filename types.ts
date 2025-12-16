export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  stock: number;
  discount_percent?: number;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: CartItem[];
}

export interface AIResponse {
  outfitName: string;
  description: string;
  suggestedItems: string[];
  stylingTips: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
