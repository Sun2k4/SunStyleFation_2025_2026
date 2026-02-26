import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * PaymentRedirect Component
 * 
 * Handles redirect from PayOS after payment completion.
 * Detects payment status from URL parameters and redirects to appropriate page.
 */
const PaymentRedirect: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Get query params from main URL (before #)
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get("payment");
        const status = urlParams.get("status");
        const cancelFlag = urlParams.get("cancel");
        const orderCode = urlParams.get("orderCode") || "";



        // Skip if no payment-related params
        if (!paymentStatus && !status && !cancelFlag) {
            return;
        }

        // Build target path based on payment result
        let targetPath = "";

        // Check for cancellation (priority)
        if (cancelFlag === "true" || status === "CANCELLED" || paymentStatus === "cancel") {
            targetPath = `/payment/cancel${orderCode ? `?orderCode=${orderCode}` : ""}`;
        }
        // Check for success
        else if (status === "PAID" || paymentStatus === "success") {
            targetPath = `/payment/success${orderCode ? `?orderCode=${orderCode}` : ""}`;
        }

        if (targetPath) {
            // Clean URL first (remove query params from main URL)
            const cleanUrl = window.location.origin + window.location.pathname + window.location.hash.split("?")[0];
            window.history.replaceState({}, "", cleanUrl);

            // Navigate using React Router
            navigate(targetPath, { replace: true });
        }
    }, [navigate]);

    return null;
};

export default PaymentRedirect;
