import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  Loader2,
  CheckCircle,
  Truck,
  ShieldCheck,
  Wallet,
  QrCode,
  Tag,
  X,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { paymentService } from "../../services/paymentService";
import { couponService } from "../../services/couponService";
import { formatPrice } from "../../utils/currency";
import { PLACEHOLDER_IMAGE, handleImageError } from '../../utils/placeholderImage';
import { CouponValidationResult } from "../../types";

type PaymentMethod = "cod" | "payos";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "success">("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const discountAmount = appliedCoupon?.valid ? (appliedCoupon.discount || 0) : 0;
  const finalTotal = cartTotal - discountAmount;

  const [formData, setFormData] = useState({
    recipientName: user?.name || "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    district: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    setAppliedCoupon(null);

    try {
      const result = await couponService.validateCoupon(couponCode, cartTotal);
      if (result.valid) {
        setAppliedCoupon(result);
        message.success(`Áp dụng mã "${result.code}" thành công!`);
      } else {
        setCouponError(result.error || "Mã giảm giá không hợp lệ");
      }
    } catch {
      setCouponError("Không thể kiểm tra mã giảm giá");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // 1. Save address
      await orderService.saveAddress(user.id, {
        recipient_name: formData.recipientName,
        phone_number: formData.phoneNumber,
        address_line: formData.addressLine,
        city: formData.city,
        district: formData.district,
      });

      // 2. Create Order
      const order = await orderService.createOrder(
        user.id,
        cart,
        finalTotal,
        undefined,
        appliedCoupon?.valid ? appliedCoupon.code : undefined,
        appliedCoupon?.valid ? discountAmount : undefined
      );

      // Mark coupon as used
      if (appliedCoupon?.valid && appliedCoupon.code) {
        await couponService.useCoupon(appliedCoupon.code);
      }

      // 3. Handle payment based on method
      if (paymentMethod === "payos") {
        // Online payment via PayOS
        const paymentResult = await paymentService.createPayment(
          String(order.id),
          cart,
          finalTotal,
          {
            name: formData.recipientName,
            email: user.email,
            phone: formData.phoneNumber,
          }
        );

        if (paymentResult.success && paymentResult.checkoutUrl) {
          // Redirect to PayOS checkout page
          paymentService.redirectToCheckout(paymentResult.checkoutUrl);
          return;
        } else {
          throw new Error(paymentResult.error || "Không thể tạo link thanh toán");
        }
      } else {
        // COD - show success immediately
        setStep("success");
        clearCart();
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Đặt hàng thất bại. Vui lòng thử lại.";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STEP
  if (step === "success") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Cảm ơn bạn đã đặt hàng!
        </h1>
        <p className="text-gray-500 mb-8 max-w-md text-lg">
          Đơn hàng của bạn đã được tiếp nhận và đang được xử lý. Bạn sẽ nhận được thông báo khi đơn hàng được giao.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="bg-white text-gray-900 px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CART
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
        <button
          onClick={() => navigate("/shop")}
          className="text-primary-600 hover:underline"
        >
          Quay lại cửa hàng
        </button>
      </div>
    );
  }

  // FORM
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Quay lại giỏ hàng
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="text-gray-900 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Thông tin giao hàng</h2>
          </div>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Tên người nhận
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                    placeholder="0901234567"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="addressLine"
                required
                value={formData.addressLine}
                onChange={handleInputChange}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                placeholder="123 Đường ABC, Phường XYZ"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Quận/Huyện
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                  placeholder="Quận 1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                  placeholder="TP. Hồ Chí Minh"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="pt-8 mt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="text-gray-900 w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-4">
                {/* COD Option */}
                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer relative overflow-hidden transition-all ${paymentMethod === "cod"
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-gray-900" : "border-gray-300"
                    }`}>
                    {paymentMethod === "cod" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 block">Thanh toán khi nhận hàng (COD)</span>
                    <span className="text-sm text-gray-500">Thanh toán tiền mặt khi nhận hàng</span>
                  </div>
                  <Truck className={`w-6 h-6 ${paymentMethod === "cod" ? "text-gray-900" : "text-gray-300"}`} />
                </label>

                {/* PayOS Online Payment Option */}
                <label
                  className={`flex items-center gap-4 p-5 rounded-2xl border-2 cursor-pointer relative overflow-hidden transition-all ${paymentMethod === "payos"
                    ? "border-primary-600 bg-primary-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="payos"
                    checked={paymentMethod === "payos"}
                    onChange={() => setPaymentMethod("payos")}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "payos" ? "border-primary-600" : "border-gray-300"
                    }`}>
                    {paymentMethod === "payos" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 block flex items-center gap-2">
                      Thanh toán online
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        Nhanh chóng
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">QR Code, Thẻ ATM, Ví điện tử (MoMo, ZaloPay...)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <QrCode className={`w-5 h-5 ${paymentMethod === "payos" ? "text-primary-600" : "text-gray-300"}`} />
                    <Wallet className={`w-5 h-5 ${paymentMethod === "payos" ? "text-primary-600" : "text-gray-300"}`} />
                  </div>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-32">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">
              Tóm tắt đơn hàng
            </h3>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.product?.image || PLACEHOLDER_IMAGE}
                      alt={item.product?.name || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={handleImageError}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                      {item.product?.name}
                    </h4>
                    <p className="text-xs font-medium text-gray-500 bg-gray-50 inline-block px-2 py-0.5 rounded">
                      SL: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <label className="text-sm font-bold text-gray-700 mb-2 block">Mã giảm giá</label>
              {appliedCoupon?.valid ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-green-600" />
                    <span className="font-bold text-green-700">{appliedCoupon.code}</span>
                    <span className="text-sm text-green-600">(-{formatPrice(discountAmount)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    placeholder="Nhập mã giảm giá"
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {couponLoading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      "Áp dụng"
                    )}
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-500 mt-2 font-medium">{couponError}</p>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600 font-bold">Miễn phí</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag size={14} />
                    Giảm giá
                  </span>
                  <span className="font-bold">-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
                <span className="text-2xl font-extrabold text-gray-900">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className={`w-full mt-8 py-4 rounded-xl font-bold transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 ${paymentMethod === "payos"
                ? "bg-primary-600 hover:bg-primary-700 text-white shadow-primary-600/20"
                : "bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/20"
                }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : paymentMethod === "payos" ? (
                <>
                  <Wallet size={20} />
                  Thanh toán online
                </>
              ) : (
                "Đặt hàng"
              )}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
              <ShieldCheck size={14} />
              Thanh toán an toàn & bảo mật
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
