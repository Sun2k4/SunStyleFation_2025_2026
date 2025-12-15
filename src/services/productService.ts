import { Product } from "../types";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { mockDb } from "./mockDb";

// Helper to map DB row to Frontend Product type
const mapDbToProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  slug:
    row.slug ||
    row.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
  price: Number(row.price),
  category: row.category,
  image: row.image_url, // Map image_url -> image
  description: row.description,
  rating: row.rating || 0, // Default values if not in DB
  reviews: row.reviews || 0,
  isNew: false,
  stock: row.stock_quantity || 0, // Map stock_quantity -> stock
  created_at: row.created_at,
});

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    if (!isSupabaseConfigured()) return mockDb.products.getAll();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }
    return data.map(mapDbToProduct);
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
    return mapDbToProduct(data);
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    if (!isSupabaseConfigured())
      return mockDb.products.getAll().find((p) => p.slug === slug);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return undefined;
    }
    return mapDbToProduct(data);
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

    const dbPayload = {
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      image_url: product.image,
      stock_quantity: product.stock,
    };

    const { data, error } = await supabase
      .from("products")
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error("Error creating product:", error);
      throw error;
    }
    return mapDbToProduct(data);
  },

  updateProduct: async (
    id: number,
    updates: Partial<Product>
  ): Promise<Product | null> => {
    if (!isSupabaseConfigured()) return mockDb.products.update(id, updates);

    const dbUpdates: any = { ...updates };
    if (updates.image !== undefined) {
      dbUpdates.image_url = updates.image;
      delete dbUpdates.image;
    }
    if (updates.stock !== undefined) {
      dbUpdates.stock_quantity = updates.stock;
      delete dbUpdates.stock;
    }

    const { data, error } = await supabase
      .from("products")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();
    if (error) return null;
    return mapDbToProduct(data);
  },

  deleteProduct: async (id: number): Promise<void> => {
    if (!isSupabaseConfigured()) {
      mockDb.products.delete(id);
      return;
    }
    await supabase.from("products").delete().eq("id", id);
  },

  uploadImage: async (file: File): Promise<string> => {
    if (!isSupabaseConfigured()) {
      // Return a fake URL if mocking
      return URL.createObjectURL(file);
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to 'product-images' bucket
    // Note: Ensure you have created a public bucket named 'product-images' in Supabase
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw new Error("Failed to upload image");
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};
