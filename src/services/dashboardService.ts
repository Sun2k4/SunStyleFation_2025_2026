import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { mockDb } from "./mockDb";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  revenueGrowth: number; // Simple calculation: positive if valid
}

export interface ChartData {
  name: string; // Month name (Jan, Feb...)
  sales: number;
  users: number;
}

export const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    if (!isSupabaseConfigured()) {
      // Mock Data Calculation
      const orders = mockDb.orders.getAll();
      const products = mockDb.products.getAll(); // Using products count as proxy for users in mock mode just to show something different, or use hardcoded

      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      return {
        totalRevenue,
        totalOrders: orders.length,
        totalUsers: 125, // Mock users
        revenueGrowth: 12.5,
      };
    }

    try {
      // 1. Fetch Orders for Revenue and Count
      const { data: orders, error: orderError } = await supabase
        .from("orders")
        .select("total_amount, created_at");

      if (orderError) throw orderError;

      // 2. Fetch Users count
      const { count: userCount, error: userError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      if (userError) throw userError;

      // 3. Calculate metrics
      const totalRevenue =
        orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;

      return {
        totalRevenue,
        totalOrders,
        totalUsers: userCount || 0,
        revenueGrowth: 0, // In a real app, calculate comparison with last month
      };
    } catch (error) {
      console.error("Dashboard Stats Error:", error);
      return {
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        revenueGrowth: 0,
      };
    }
  },

  getChartData: async (): Promise<ChartData[]> => {
    if (!isSupabaseConfigured()) {
      return [
        { name: "Jan", sales: 4000, users: 240 },
        { name: "Feb", sales: 3000, users: 139 },
        { name: "Mar", sales: 2000, users: 980 },
        { name: "Apr", sales: 2780, users: 390 },
        { name: "May", sales: 1890, users: 480 },
        { name: "Jun", sales: 2390, users: 380 },
        { name: "Jul", sales: 3490, users: 430 },
      ];
    }

    try {
      // Fetch data created in the current year to categorize by month
      // For simplicity in this demo, we fetch all and process in JS
      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, created_at")
        .order("created_at", { ascending: true });

      const { data: users } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: true });

      // Initialize months
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const chartMap = new Map<string, ChartData>();

      months.forEach((m) => chartMap.set(m, { name: m, sales: 0, users: 0 }));

      // Aggregate Sales
      orders?.forEach((order) => {
        const date = new Date(order.created_at);
        const monthName = months[date.getMonth()];
        const entry = chartMap.get(monthName);
        if (entry) {
          entry.sales += Number(order.total_amount);
        }
      });

      // Aggregate Users (Signups)
      users?.forEach((user) => {
        const date = new Date(user.created_at);
        const monthName = months[date.getMonth()];
        const entry = chartMap.get(monthName);
        if (entry) {
          entry.users += 1;
        }
      });

      // Convert Map to Array, filtering out future months or keeping all
      // For this demo, let's just return all 12 months or filter trailing zero months if desired
      return Array.from(chartMap.values());
    } catch (error) {
      console.error("Chart Data Error:", error);
      return [];
    }
  },
};
