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
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { orderService } from "../../services/orderService";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"details" | "success">("details");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // 1. Save address (optional enhancement based on DB schema)
      await orderService.saveAddress(user.id, {
        recipient_name: formData.recipientName,
        phone_number: formData.phoneNumber,
        address_line: formData.addressLine,
        city: formData.city,
        district: formData.district,
        is_default: true,
      });

      // 2. Create Order
      await orderService.createOrder(user.id, cart, cartTotal);

      // 3. Update UI FIRST to prevent "Empty Cart" flash or logic trap
      setStep("success");

      // 4. Then clear cart
      clearCart();
    } catch (error) {
      console.error(error);
      message.error(error.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // PRIORITY 1: Check Success Step FIRST
  if (step === "success") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-fade-in-up">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-500 mb-8 max-w-md">
          Thank you for your purchase. We have received your order and are
          processing it.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // PRIORITY 2: Check Empty Cart ONLY if not in success step
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/shop")}
          className="text-primary-600 hover:underline"
        >
          Go back to shop
        </button>
      </div>
    );
  }

  // PRIORITY 3: Render Form
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" /> Back to Cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="text-primary-500" /> Shipping Details
          </h2>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="+123456789"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line
              </label>
              <input
                type="text"
                name="addressLine"
                required
                value={formData.addressLine}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="123 Fashion St, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-primary-500" /> Payment Method
              </h3>
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-blue-800 text-sm">
                Cash on Delivery (COD) is currently the only available payment
                method.
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 rounded-md object-cover bg-white"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-200 mt-2">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-primary-500 text-white py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
