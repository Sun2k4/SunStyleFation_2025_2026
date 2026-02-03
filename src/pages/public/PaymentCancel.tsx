import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { paymentService } from "../../services/paymentService";
import { message } from "antd";

const CANCEL_REASONS = [
    { id: "changed_mind", label: "Tôi đổi ý, không muốn mua nữa" },
    { id: "wrong_item", label: "Tôi chọn nhầm sản phẩm" },
    { id: "found_cheaper", label: "Tìm thấy giá rẻ hơn ở nơi khác" },
    { id: "payment_issue", label: "Gặp vấn đề khi thanh toán" },
    { id: "other", label: "Lý do khác" },
];

const PaymentCancel: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    const [selectedReason, setSelectedReason] = useState<string>("");
    const [otherReason, setOtherReason] = useState("");
    const [isConfirming, setIsConfirming] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);

    const handleConfirmCancel = async () => {
        if (!selectedReason) {
            message.warning("Vui lòng chọn lý do hủy đơn hàng");
            return;
        }

        setIsConfirming(true);

        try {
            const reason = selectedReason === "other" ? otherReason :
                CANCEL_REASONS.find(r => r.id === selectedReason)?.label || "";

            if (orderCode) {
                await paymentService.cancelPayment(orderCode, reason);
            }

            setIsCancelled(true);
            message.success("Đã hủy đơn hàng thành công");
        } catch (error) {
            console.error("Cancel error:", error);
            message.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
        } finally {
            setIsConfirming(false);
        }
    };

    if (isCancelled) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="w-10 h-10 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Đơn hàng đã được hủy</h1>
                <p className="text-gray-500 mb-6">Đơn hàng của bạn đã được hủy thành công.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate("/shop")}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Tiếp tục mua sắm
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] max-w-lg mx-auto px-4 py-8">
            <button
                onClick={() => navigate("/cart")}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Quay lại giỏ hàng
            </button>

            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác nhận hủy đơn hàng</h1>
                <p className="text-gray-500">
                    Bạn có chắc chắn muốn hủy đơn hàng này không?
                </p>
                {orderCode && (
                    <p className="text-sm text-gray-400 mt-2">Mã đơn: #{orderCode}</p>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-bold text-gray-900 mb-4">Lý do hủy đơn hàng</h2>
                <div className="space-y-3">
                    {CANCEL_REASONS.map((reason) => (
                        <label
                            key={reason.id}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedReason === reason.id
                                    ? "border-primary-500 bg-primary-50"
                                    : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <input
                                type="radio"
                                name="cancelReason"
                                value={reason.id}
                                checked={selectedReason === reason.id}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="sr-only"
                            />
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedReason === reason.id
                                        ? "border-primary-500"
                                        : "border-gray-300"
                                    }`}
                            >
                                {selectedReason === reason.id && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                                )}
                            </div>
                            <span className="text-gray-700">{reason.label}</span>
                        </label>
                    ))}
                </div>

                {selectedReason === "other" && (
                    <textarea
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Vui lòng nhập lý do của bạn..."
                        className="w-full mt-4 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        rows={3}
                    />
                )}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/checkout")}
                    className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    Quay lại thanh toán
                </button>
                <button
                    onClick={handleConfirmCancel}
                    disabled={isConfirming || !selectedReason}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isConfirming ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Đang xử lý...
                        </>
                    ) : (
                        "Xác nhận hủy"
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentCancel;
