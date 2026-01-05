import { Order, CartItem, Address } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { mockDb } from "./mockDb";

export const orderService = {
  // ADMIN: Get all orders with user details
  getAllOrders: async (): Promise<Order[]> => {
    if (!isSupabaseConfigured()) return mockDb.orders.getAll();

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id, 
        created_at, 
        status, 
        total_amount,
        payment_method,
        shipping_address_id,
        tracking_number,
        notes,
        user_id,
        profiles:user_id (
          full_name,
          email
        ),
        order_items (
          id,
          quantity,
          price_at_purchase,
          products (
            name,
            image_url
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      date: row.created_at,
      total: Number(row.total_amount),
      status: row.status,
      total_amount: Number(row.total_amount),
      payment_method: row.payment_method,
      shipping_address_id: row.shipping_address_id,
      tracking_number: row.tracking_number,
      notes: row.notes,
      userInfo: {
        name: row.profiles?.full_name || "Unknown User",
        email: row.profiles?.email || "No Email",
      },
      items: row.order_items.map((item: any) => ({
        id: item.id,
        orderId: row.id,
        productId: 0,
        quantity: item.quantity,
        priceAtPurchase: Number(item.price_at_purchase),
        product: {
          name: item.products?.name || "Unknown Product",
          image: item.products?.image_url || "",
          price: Number(item.price_at_purchase),
        },
      })),
    }));
  },

  // ADMIN: Update order status
  updateOrderStatus: async (orderId: number, status: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      // Mock update
      const orders = mockDb.orders.getAll();
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status as any;
        mockDb.orders.save(orders);
      }
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // USER: Fetch orders for a specific user
  getUserOrders: async (userId: string): Promise<Order[]> => {
    if (!isSupabaseConfigured())
      return mockDb.orders.getAll().filter((o) => o.userId === userId);

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id, 
        created_at, 
        status, 
        total_amount,
        payment_method,
        shipping_address_id,
        tracking_number,
        notes,
        order_items (
          id,
          quantity,
          price_at_purchase,
          products (
            name,
            image_url
          )
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      userId: userId,
      date: row.created_at,
      total: Number(row.total_amount),
      status: row.status,
      total_amount: Number(row.total_amount),
      payment_method: row.payment_method,
      shipping_address_id: row.shipping_address_id,
      tracking_number: row.tracking_number,
      notes: row.notes,
      items: row.order_items.map((item: any) => ({
        id: item.id,
        orderId: row.id,
        productId: 0,
        quantity: item.quantity,
        priceAtPurchase: Number(item.price_at_purchase),
        product: {
          name: item.products?.name || "Unknown Product",
          image: item.products?.image_url || "",
          price: Number(item.price_at_purchase),
        },
      })),
    })) as Order[];
  },

  // USER: Cancel their own pending order
  cancelOrder: async (orderId: number): Promise<boolean> => {
    if (!isSupabaseConfigured()) {
      const orders = mockDb.orders.getAll();
      const order = orders.find((o) => o.id === orderId);
      if (order && order.status === "pending") {
        order.status = "cancelled";
        mockDb.orders.save(orders);
        return true;
      }
      return false;
    }

    // Policy "Users can cancel own pending orders" enforced by RLS
    // We explicitly check status='Pending' in the query for extra safety/clarity
    const { error, data } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .eq("status", "pending") // Ensures we only cancel if currently pending
      .select("id"); // Get data to verify update happened

    if (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }

    // If data is empty, it means the order wasn't found OR it wasn't in Pending state
    return data !== null && data.length > 0;
  },

  // Save address to user_addresses table
  saveAddress: async (
    userId: string,
    address: Omit<Address, "id" | "user_id">
  ) => {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from("user_addresses").insert([
      {
        user_id: userId,
        ...address,
        is_default: true,
      },
    ]);
    if (error) console.error("Error saving address:", error);
  },

  // Create Order Transaction
  createOrder: async (
    userId: string,
    items: CartItem[],
    total: number,
    address?: any
  ): Promise<Order | null> => {
    if (!isSupabaseConfigured()) {
      const mockOrder = {
        id: Math.floor(Math.random() * 10000),
        userId,
        date: new Date().toISOString(),
        total,
        total_amount: total,
        status: "pending",
        items,
        payment_method: "credit_card",
        shipping_address_id: null,
        tracking_number: null,
        notes: null,
      } as unknown as Order;
      return mockDb.orders.add(mockOrder);
    }

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_amount: total,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      throw orderError;
    }

    const orderId = orderData.id;

    // Map cart items to order items
    // New CartItem structure: { variant_id, quantity, product: {...}, variant: {...} }
    const orderItems = items.map((item) => {
      const productId = item.product?.id;
      const basePrice = item.product?.price || 0;
      const priceAdjustment = item.variant?.price_adjustment || 0;
      const finalPrice = basePrice + priceAdjustment;

      return {
        order_id: orderId,
        product_id: productId,
        variant_id: item.variant_id,
        quantity: item.quantity,
        price_at_purchase: finalPrice,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 4. Update Stock (Decrement quantity)
    // Run sequentially to avoid race conditions or use RPC
    for (const item of orderItems) {
      if (item.variant_id) {
        const { error: stockError } = await supabase.rpc('decrement_stock', {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity
        });

        if (stockError) {
          console.error(`Failed to decrement stock for variant ${item.variant_id}:`, stockError);
          // Optional: We could rollback here, but for now just log it
        }
      }
    }

    return {
      id: orderId,
      userId,
      date: orderData.created_at,
      total: orderData.total_amount,
      total_amount: orderData.total_amount,
      status: orderData.status,
      payment_method: orderData.payment_method,
      shipping_address_id: orderData.shipping_address_id,
      tracking_number: orderData.tracking_number,
      notes: orderData.notes,
      items: items as any,
    };
  },
};
