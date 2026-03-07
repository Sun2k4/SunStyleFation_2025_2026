import { supabase } from "./supabaseClient";
import { Review } from "../types";

// Helper to map DB row to frontend Review type
const mapDbToReview = (row: any): Review => ({
    ...row,
    userName: row.profiles?.full_name || 'Anonymous',
    userAvatar: row.profiles?.avatar_url || null,
});

export const reviewService = {
    /**
     * Fetch all reviews for a product, with user profile info, ordered newest first.
     */
    getReviewsByProductId: async (productId: number): Promise<Review[]> => {
        const { data, error } = await supabase
            .from("reviews")
            .select(`
        *,
        profiles(full_name, avatar_url)
      `)
            .eq("product_id", productId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching reviews:", error);
            return [];
        }
        return (data || []).map(mapDbToReview);
    },

    /**
     * Submit a new review (1-5 stars + optional comment).
     */
    submitReview: async (params: {
        productId: number;
        userId: string;
        rating: number;
        comment?: string;
    }): Promise<Review | null> => {
        const { data, error } = await supabase
            .from("reviews")
            .insert({
                product_id: params.productId,
                user_id: params.userId,
                rating: params.rating,
                comment: params.comment || null,
            })
            .select(`
        *,
        profiles(full_name, avatar_url)
      `)
            .single();

        if (error) {
            console.error("Error submitting review:", error);
            throw error;
        }
        return mapDbToReview(data);
    },

    /**
     * Update an existing review.
     */
    updateReview: async (
        reviewId: number,
        updates: { rating?: number; comment?: string }
    ): Promise<Review | null> => {
        const { data, error } = await supabase
            .from("reviews")
            .update(updates)
            .eq("id", reviewId)
            .select(`
        *,
        profiles(full_name, avatar_url)
      `)
            .single();

        if (error) {
            console.error("Error updating review:", error);
            throw error;
        }
        return mapDbToReview(data);
    },

    /**
     * Delete a review by ID.
     */
    deleteReview: async (reviewId: number): Promise<void> => {
        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", reviewId);

        if (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    },

    /**
     * Check if a user already reviewed a specific product.
     * Returns the existing review or null.
     */
    getUserReviewForProduct: async (
        productId: number,
        userId: string
    ): Promise<Review | null> => {
        const { data, error } = await supabase
            .from("reviews")
            .select(`
        *,
        profiles(full_name, avatar_url)
      `)
            .eq("product_id", productId)
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            console.error("Error checking user review:", error);
            return null;
        }
        return data ? mapDbToReview(data) : null;
    },
};
