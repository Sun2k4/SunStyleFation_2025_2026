// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const body = await req.json();
        console.log("Webhook received:", JSON.stringify(body, null, 2));

        // Handle manual cancellation from frontend
        if (body.action === "cancel") {
            const { orderCode, reason } = body;
            console.log(`Order ${orderCode} cancelled. Reason: ${reason}`);

            // Here you would update your database to mark the order as cancelled
            // For now, just return success
            return new Response(
                JSON.stringify({ success: true, message: "Order cancelled" }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Handle PayOS webhook callback
        const { code, data } = body;

        if (code === "00" && data) {
            const { orderCode, status } = data;
            console.log(`PayOS webhook: Order ${orderCode} status: ${status}`);

            // Update order status in database based on PayOS status
            // PAID, PENDING, CANCELLED, etc.

            return new Response(
                JSON.stringify({ success: true }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: false, message: "Invalid webhook data" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Webhook error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
