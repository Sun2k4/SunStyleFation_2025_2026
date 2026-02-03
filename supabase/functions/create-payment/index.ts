// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const PAYOS_API_URL = "https://api-merchant.payos.vn/v2/payment-requests";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentItem {
    name: string;
    quantity: number;
    price: number;
}

interface PaymentRequest {
    orderId: string;
    amount: number;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    items?: PaymentItem[];
    buyerName?: string;
    buyerEmail?: string;
    buyerPhone?: string;
}

serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const clientId = Deno.env.get("PAYOS_CLIENT_ID");
        const apiKey = Deno.env.get("PAYOS_API_KEY");
        const checksumKey = Deno.env.get("PAYOS_CHECKSUM_KEY");

        if (!clientId || !apiKey || !checksumKey) {
            console.error("Missing PayOS credentials");
            return new Response(
                JSON.stringify({ error: "PayOS credentials not configured" }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const body: PaymentRequest = await req.json();
        console.log("Payment request received:", JSON.stringify(body, null, 2));

        const {
            orderId,
            amount,
            description,
            returnUrl,
            cancelUrl,
            items = [],
            buyerName,
            buyerEmail,
            buyerPhone,
        } = body;

        // Validate required fields
        if (!orderId || !amount || !returnUrl || !cancelUrl) {
            return new Response(
                JSON.stringify({ error: "Missing required fields: orderId, amount, returnUrl, cancelUrl" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Validate amount (PayOS minimum is 1000 VND)
        if (amount < 1000) {
            return new Response(
                JSON.stringify({ error: "Amount must be at least 1000 VND" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Generate unique order code (PayOS requires numeric, max 9007199254740991)
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        const orderCode = parseInt(`${timestamp}${random}`.slice(-15));

        // Build checksum string (PayOS format: amount + orderCode + description + key)
        const checksumData = `${amount}${orderCode}${description}${checksumKey}`;

        // Create SHA-256 hash
        const encoder = new TextEncoder();
        const data = encoder.encode(checksumData);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

        // Build URLs - append orderCode to both for tracking
        const finalReturnUrl = returnUrl.includes('?')
            ? `${returnUrl}&orderCode=${orderCode}`
            : `${returnUrl}?orderCode=${orderCode}`;
        const finalCancelUrl = cancelUrl.includes('?')
            ? `${cancelUrl}&orderCode=${orderCode}`
            : `${cancelUrl}?orderCode=${orderCode}`;

        const paymentData: Record<string, unknown> = {
            orderCode,
            amount: Math.round(amount),
            description: description.substring(0, 25), // PayOS limit
            cancelUrl: finalCancelUrl,
            returnUrl: finalReturnUrl,
            signature,
        };

        // Add optional buyer info
        if (buyerName) paymentData.buyerName = buyerName;
        if (buyerEmail) paymentData.buyerEmail = buyerEmail;
        if (buyerPhone) paymentData.buyerPhone = buyerPhone;

        // Add items if present
        if (items.length > 0) {
            paymentData.items = items.map(item => ({
                name: item.name.substring(0, 50),
                quantity: item.quantity,
                price: Math.round(item.price),
            }));
        }

        console.log("Sending to PayOS:", JSON.stringify(paymentData, null, 2));

        // Call PayOS API
        const payosResponse = await fetch(PAYOS_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-client-id": clientId,
                "x-api-key": apiKey,
            },
            body: JSON.stringify(paymentData),
        });

        const payosResult = await payosResponse.json();
        console.log("PayOS response:", JSON.stringify(payosResult, null, 2));

        if (payosResult.code === "00" && payosResult.data?.checkoutUrl) {
            return new Response(
                JSON.stringify({
                    success: true,
                    checkoutUrl: payosResult.data.checkoutUrl,
                    orderCode: payosResult.data.orderCode,
                    qrCode: payosResult.data.qrCode,
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // PayOS error
        return new Response(
            JSON.stringify({
                success: false,
                error: payosResult.desc || payosResult.message || "Payment creation failed",
                code: payosResult.code,
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Edge function error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal server error" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
