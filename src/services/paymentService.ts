import { supabase } from "./supabaseClient";

interface PaymentRequest {
    orderId: string;
    amount: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
}

interface PaymentResponse {
    success: boolean;
    checkoutUrl?: string;
    orderCode?: number;
    error?: string;
}

interface CartItem {
    id?: number;
    variant_id: number;
    quantity: number;
    product?: {
        id?: number;
        name: string;
        price: number;
        image?: string;
    };
    variant?: {
        price_adjustment?: number | null;
    };
}

export const paymentService = {
    /**
     * Create a PayOS payment request
     */
    async createPayment(
        orderId: string,
        cartItems: CartItem[],
        totalAmount: number,
        buyerInfo?: {
            name?: string;
            email?: string;
            phone?: string;
        }
    ): Promise<PaymentResponse> {
        try {
            const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;

            // Build items for PayOS - handle nested product structure
            const items = cartItems.map(item => ({
                name: (item.product?.name || "Sản phẩm").substring(0, 50), // PayOS limit
                quantity: item.quantity,
                price: Math.round((item.product?.price || 0) + (item.variant?.price_adjustment || 0)),
            }));

            const paymentData: PaymentRequest = {
                orderId,
                amount: Math.round(totalAmount),
                description: `Thanh toán đơn hàng #${orderId.substring(0, 8)}`,
                returnUrl: `${appUrl}?payment=success`,
                cancelUrl: `${appUrl}?payment=cancel`,
                buyerName: buyerInfo?.name,
                buyerEmail: buyerInfo?.email,
                buyerPhone: buyerInfo?.phone,
            };

            // Call Supabase Edge Function
            const { data, error } = await supabase.functions.invoke('create-payment', {
                body: {
                    ...paymentData,
                    items,
                },
            });

            if (error) {
                console.error("Payment creation error:", error);
                return {
                    success: false,
                    error: error.message || "Không thể tạo thanh toán",
                };
            }

            if (data?.checkoutUrl) {
                return {
                    success: true,
                    checkoutUrl: data.checkoutUrl,
                    orderCode: data.orderCode,
                };
            }

            return {
                success: false,
                error: data?.error || "Không nhận được link thanh toán",
            };
        } catch (error) {
            console.error("Payment service error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Lỗi không xác định",
            };
        }
    },

    /**
     * Redirect to PayOS checkout page
     */
    redirectToCheckout(checkoutUrl: string): void {
        window.location.href = checkoutUrl;
    },

    /**
     * Cancel a PayOS payment (called from cancel page)
     */
    async cancelPayment(orderCode: string, reason?: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { data, error } = await supabase.functions.invoke('payos-webhook', {
                body: {
                    action: 'cancel',
                    orderCode,
                    reason,
                },
            });

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : "Lỗi hủy thanh toán",
            };
        }
    },
};
