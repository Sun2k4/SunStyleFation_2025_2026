import { Category } from "../types";
import { supabase } from "./supabaseClient";

// Helper to map DB row to Frontend Category type
const mapDbToCategory = (row: any): Category => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    created_at: row.created_at || new Date().toISOString(), // Fallback for safety
    productCount: row.product_count || 0,
});

export const categoryService = {
    getAllCategories: async (): Promise<Category[]> => {
        const { data: categories, error } = await supabase
            .from("categories")
            .select("*")
            .order("name", { ascending: true }); // Ensure ordering

        if (error) {
            console.error("Supabase error (categories):", error);
            return [];
        }

        // Count products per category using category_id
        const { data: products, error: productError } = await supabase
            .from("products")
            .select("category_id");

        if (productError) {
            console.warn("Supabase error (product counts):", productError);
            // Continue even if product counts fail, just show 0
        }

        const counts: Record<number, number> = {};
        if (products) {
            products.forEach((p: any) => {
                const catId = p.category_id;
                if (catId) {
                    counts[catId] = (counts[catId] || 0) + 1;
                }
            });
        }

        // Transform data to match interface
        return categories.map((item: any) => ({
            ...mapDbToCategory(item),
            productCount: counts[item.id] || 0
        }));
    },

    createCategory: async (category: Omit<Category, "id" | "productCount">): Promise<Category> => {
        const { data, error } = await supabase
            .from("categories")
            .insert([category])
            .select()
            .single();

        if (error) throw error;
        return mapDbToCategory(data);
    },

    updateCategory: async (id: number, updates: Partial<Category>): Promise<Category | null> => {
        const { data, error } = await supabase
            .from("categories")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return null;
        return mapDbToCategory(data);
    },

    deleteCategory: async (id: number): Promise<void> => {
        const { error } = await supabase.from("categories").delete().eq("id", id);

        if (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    }
};
