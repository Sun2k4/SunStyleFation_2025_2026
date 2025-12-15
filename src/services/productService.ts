import { Product } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { mockDb } from "./mockDb";

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured()) return mockDb.products.getAll();

    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.error("Supabase error:", error);
      return [];
    }
    return data as Product[];
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    if (!isSupabaseConfigured())
      return mockDb.products.getAll().find((p) => p.id === id);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return data as Product;
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    if (!isSupabaseConfigured())
      return mockDb.products.getAll().find((p) => p.slug === slug);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();
    if (error) return undefined;
    return data as Product;
  },

  createProduct: async (product: Omit<Product, "id">): Promise<Product> => {
    if (!isSupabaseConfigured()) {
      const newProduct = {
        ...product,
        id: Date.now(),
        rating: 0,
        reviews: 0,
        stock: product.stock || 0,
      };
      return mockDb.products.add(newProduct);
    }

    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  updateProduct: async (
    id: number,
    updates: Partial<Product>
  ): Promise<Product | null> => {
    if (!isSupabaseConfigured()) return mockDb.products.update(id, updates);

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) return null;
    return data as Product;
  },

  deleteProduct: async (id: number): Promise<void> => {
    if (!isSupabaseConfigured()) {
      mockDb.products.delete(id);
      return;
    }
    await supabase.from("products").delete().eq("id", id);
  },
};
