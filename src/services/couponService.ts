import { supabase } from "./supabaseClient";
import { Coupon, CouponValidationResult } from "../types";

export const couponService = {
    // Validate coupon via server-side RPC (secure)
    validateCoupon: async (
        code: string,
        orderTotal: number
    ): Promise<CouponValidationResult> => {
        const { data, error } = await supabase.rpc("validate_coupon", {
            p_code: code.toUpperCase().trim(),
            p_order_total: orderTotal,
        });

        if (error) {
            console.error("Coupon validation error:", error);
            return { valid: false, error: "Không thể kiểm tra mã giảm giá" };
        }

        return data as CouponValidationResult;
    },

    // Mark coupon as used (increment used_count)
    useCoupon: async (code: string): Promise<void> => {
        const { error } = await supabase.rpc("use_coupon", {
            p_code: code.toUpperCase().trim(),
        });

        if (error) {
            console.error("Use coupon error:", error);
        }
    },

    // ADMIN: Get all coupons
    getAllCoupons: async (): Promise<Coupon[]> => {
        const { data, error } = await supabase
            .from("coupons")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching coupons:", error);
            return [];
        }

        return data as Coupon[];
    },

    // ADMIN: Create a new coupon
    createCoupon: async (
        coupon: Omit<Coupon, "id" | "created_at" | "used_count">
    ): Promise<Coupon | null> => {
        const { data, error } = await supabase
            .from("coupons")
            .insert([{ ...coupon, code: coupon.code.toUpperCase().trim(), used_count: 0 }])
            .select()
            .single();

        if (error) {
            console.error("Error creating coupon:", error);
            throw error;
        }

        return data as Coupon;
    },

    // ADMIN: Update a coupon
    updateCoupon: async (
        id: number,
        updates: Partial<Coupon>
    ): Promise<void> => {
        if (updates.code) {
            updates.code = updates.code.toUpperCase().trim();
        }
        const { error } = await supabase
            .from("coupons")
            .update(updates)
            .eq("id", id);

        if (error) {
            console.error("Error updating coupon:", error);
            throw error;
        }
    },

    // ADMIN: Delete a coupon
    deleteCoupon: async (id: number): Promise<void> => {
        const { error } = await supabase
            .from("coupons")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting coupon:", error);
            throw error;
        }
    },

    // ADMIN: Toggle coupon active status
    toggleCouponActive: async (
        id: number,
        isActive: boolean
    ): Promise<void> => {
        const { error } = await supabase
            .from("coupons")
            .update({ is_active: isActive })
            .eq("id", id);

        if (error) {
            console.error("Error toggling coupon:", error);
            throw error;
        }
    },
};
