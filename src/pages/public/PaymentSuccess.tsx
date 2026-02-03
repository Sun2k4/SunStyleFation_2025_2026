import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Package, Home, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");
    const { clearCart } = useCart();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        // Clear cart on successful payment
        clearCart();

        // Simulate verification delay
        const timer = setTimeout(() => {
            setIsVerifying(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [clearCart]);

    if (isVerifying) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-600">Đang xác nhận thanh toán...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 animate-fade-in">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Thanh toán thành công!
            </h1>

            <p className="text-gray-500 text-center mb-6 max-w-md">
                Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
            </p>

            {orderCode && (
                <div className="bg-gray-50 rounded-xl px-6 py-4 mb-8 text-center">
                    <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                    <p className="text-xl font-bold text-gray-900 font-mono">#{orderCode}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                    <Package size={20} />
                    Xem đơn hàng
                </button>
                <button
                    onClick={() => navigate("/shop")}
                    className="flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <Home size={20} />
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
