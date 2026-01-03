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
        is_default: true,
      });

      // 2. Create Order
      await orderService.createOrder(user.id, cart, cartTotal);

      // 3. Update UI
      setStep("success");

      // 4. Clear cart
      clearCart();
    } catch (error) {
      console.error(error);
      message.error("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STEP
  if (step === "success") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-green-50/50">
          <CheckCircle className="w-12 h-12 text-green-500 animate-[bounce_1s_infinite]" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-gray-500 mb-8 max-w-md text-lg">
          We have received your order and are preparing it for shipment. You will receive a confirmation email shortly.
        </p>
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 w-full max-w-sm border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Order Number</span>
            <span className="font-mono font-bold text-gray-900">#{Math.floor(Math.random() * 100000)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Estimated Delivery</span>
            <span className="font-bold text-gray-900">3-5 Business Days</span>
          </div>
        </div>
        <div className="flex gap-4 flex-col sm:flex-row w-full sm:w-auto">
          <button
            onClick={() => navigate("/profile")}
            className="bg-white border text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all flex-1"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex-1"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CART CHECK
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/shop")}
          className="text-primary-600 hover:underline font-bold"
        >
          Go back to shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" /> Back to Cart
        </button>

        {/* Progress Stepper */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-12">
          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-green-500/30">
              <CheckCircle size={20} />
            </div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Cart</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4 relative self-start mt-5">
            <div className="absolute left-0 top-0 h-full bg-green-500 w-full rounded-full"></div>
          </div>

          <div className="flex flex-col items-center relative z-10">
            <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold mb-2 shadow-lg shadow-gray-900/30">
              2
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Checkout</span>
          </div>
          <div className="flex-1 h-1 bg-gray-200 mx-4 relative self-start mt-5"></div>

          <div className="flex flex-col items-center relative z-10 opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold mb-2">
              3
            </div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Success</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Shipping Form */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <MapPin className="text-gray-900 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
          </div>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Recipient Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                  <input
                    type="text"
                    name="recipientName"
                    required
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 text-gray-400 w-5 h-5 group-focus-within:text-gray-900 transition-colors" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                    placeholder="+123456789"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                Address Line
              </label>
              <input
                type="text"
                name="addressLine"
                required
                value={formData.addressLine}
                onChange={handleInputChange}
                className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                placeholder="123 Fashion St, Apt 4B"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                  placeholder="District"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 rounded-2xl outline-none transition-all font-medium"
                  placeholder="City"
                />
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="text-gray-900 w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
              </div>

              <label className="flex items-center gap-4 p-5 rounded-2xl border-2 border-gray-900 bg-gray-50 cursor-pointer relative overflow-hidden transition-all">
                <div className="w-5 h-5 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-900"></div>
                </div>
                <div className="flex-1">
                  <span className="font-bold text-gray-900 block">Cash on Delivery (COD)</span>
                  <span className="text-sm text-gray-500">Pay when you receive your order</span>
                </div>
                <Truck className="text-gray-900 w-6 h-6 opacity-20" />
              </label>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 sticky top-32">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">
              Order Summary
            </h3>
            <div className="space-y-5 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs font-medium text-gray-500 bg-gray-50 inline-block px-2 py-0.5 rounded">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold">Free</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="text-3xl font-extrabold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              form="checkout-form"
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
            </button>

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
              <ShieldCheck size={14} />
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
