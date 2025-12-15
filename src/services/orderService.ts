import { Order, CartItem } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { mockDb } from "./mockDb";

export const orderService = {
  getAllOrders: async (): Promise<Order[]> => {
    if (!isSupabaseConfigured()) return mockDb.orders.getAll();

    const { data, error } = await supabase.from("orders").select("*");
    if (error) return [];
    return data as Order[];
  },

  getUserOrders: async (userId: string): Promise<Order[]> => {
    if (!isSupabaseConfigured())
      return mockDb.orders.getAll().filter((order) => order.userId === userId);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("userId", userId);
    if (error) return [];
    return data as Order[];
  },

  createOrder: async (
    userId: string,
    items: CartItem[],
    total: number
  ): Promise<Order> => {
    const newOrder = {
      userId,
      date: new Date().toISOString().split("T")[0],
      total,
      status: "Pending",
      items, // Assumes DB has a JSONB column for items or similar structure
    };

    if (!isSupabaseConfigured()) {
      const mockOrder = {
        ...newOrder,
        id: `ORD-${Math.floor(Math.random() * 10000)}`,
      } as Order;
      return mockDb.orders.add(mockOrder);
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([newOrder])
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  },

  updateOrderStatus: async (
    orderId: string,
    status: Order["status"]
  ): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      const orders = mockDb.orders.getAll();
      const index = orders.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        orders[index].status = status;
        mockDb.orders.save(orders);
        return orders[index];
      }
      return null;
    }

    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();
    if (error) return null;
    return data as Order;
  },
};
