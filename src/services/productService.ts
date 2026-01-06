import { Product } from "../types";
import { supabase } from "./supabaseClient";

// Helper to map DB row to Frontend Product type
const mapDbToProduct = (row: any): Product => ({
  // Spread all DB fields (id, name, price, category_id, description, created_at)
  ...row,

  // Map database field names to frontend field names
  image: row.image_url || '',
  stock: row.stock_quantity || 0,

  // Generate slug if not present
  slug: row.slug || row.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),

  // Display fields from joins
  categoryName: row.categories?.name,

  // Nested relations
  variants: row.product_variants || [],
  reviewsList: row.reviews_list || [],

  // Legacy fields for compatibility
  rating: row.rating || 5.0,
  reviews: row.reviews_count || 0,
  isNew: false,
});

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return [];
    }
    return data.map(mapDbToProduct);
  },

  // New Arrivals - products ordered by created_at desc, limit 8
  getNewArrivals: async (limit: number = 8): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug)
      `)
      .not("category_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }
    return data.map(mapDbToProduct);
  },

  // Best Sellers - products with high rating (simulated, no sold_count)
  getBestSellers: async (limit: number = 8): Promise<Product[]> => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug)
      `)
      .not("category_id", "is", null)
      .order("rating", { ascending: false, nullsFirst: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching best sellers:", error);
      return [];
    }
    return data.map(mapDbToProduct);
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories(id, name, slug),
        product_variants(id, size, color, stock_quantity, sku, price_adjustment),
        reviews_list:reviews(id, rating, comment, created_at, user_id, profiles(full_name, avatar_url))
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      return undefined;
    }
    return mapDbToProduct(data);
  },

  getProductBySlug: async (slug: string): Promise<Product | undefined> => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return undefined;
    return mapDbToProduct(data);
  },

  createProduct: async (product: Omit<Product, "id" | "created_at">): Promise<Product> => {
    const dbPayload = {
      name: product.name,
      category_id: product.category_id, // Use category_id instead of category
      price: product.price,
      description: product.description,
      image_url: product.image,
      stock_quantity: product.stock,
      // created_at is auto-handled by DB
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
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.category_id !== undefined) dbUpdates.category_id = updates.category_id;
    if (updates.price) dbUpdates.price = updates.price;
    if (updates.description) dbUpdates.description = updates.description;

    // Handle mapped fields
    if (updates.image !== undefined) dbUpdates.image_url = updates.image;
    if (updates.stock !== undefined) dbUpdates.stock_quantity = updates.stock;

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
    await supabase.from("products").delete().eq("id", id);
  },

  uploadImage: async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

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
