import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { orderService } from "../../services/orderService";
import { Order } from "../../types";
import { formatPrice } from "../../utils/currency";
import {
  Package,
  LogOut,
  User as UserIcon,
  Loader2,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. Import các component của Ant Design
import { message, Popconfirm, Tag, Button } from "antd";

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  // Đã xóa useToast
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Không cần state cancelOrderId hay isCancelling nữa vì Popconfirm tự xử lý loading

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    try {
      const data = await orderService.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Hàm hủy đơn giản gọn hơn nhiều
  const handleCancelOrder = async (orderId: number) => {
    try {
      await orderService.cancelOrder(orderId);

      // Thay thế toast bằng message
      message.success("Đã hủy đơn hàng thành công");

      // Cập nhật UI ngay lập tức
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
    } catch (error) {
      console.error("Cancel failed", error);
      message.error("Không thể hủy đơn hàng này. Có thể đơn đã được duyệt.");
      loadOrders(); // Tải lại để lấy trạng thái đúng nhất
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">Please login to view your profile.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full mb-4 overflow-hidden">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-xl font-medium">
                <Package size={20} /> My Orders
              </button>
              <button
                disabled
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 cursor-not-allowed hover:bg-gray-50 rounded-xl font-medium"
              >
                <UserIcon size={20} /> Account Settings
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 font-medium flex items-center justify-center gap-2 mx-auto"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Order History
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No orders yet
              </h3>
              <p className="text-gray-500 mb-6">
                Looks like you haven't made any purchases yet.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-gray-100">
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="block text-gray-500">
                          Order Placed
                        </span>
                        <span className="font-medium text-gray-900">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500">
                          Total Amount
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Dùng Antd Tag thay cho span thủ công */}
                      <Tag
                        color={
                          order.status === "pending"
                            ? "orange"
                            : order.status === "processing"
                              ? "blue"
                              : order.status === "shipped"
                                ? "purple"
                                : order.status === "delivered"
                                  ? "green"
                                  : "red"
                        }
                        className="capitalize"
                      >
                        {order.status}
                      </Tag>

                      {/* Cancel Button với Popconfirm - Chỉ hiện khi Pending */}
                      {order.status === "pending" && (
                        <Popconfirm
                          title="Hủy đơn hàng?"
                          description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
                          onConfirm={() => handleCancelOrder(order.id)}
                          okText="Đồng ý"
                          cancelText="Không"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<XCircle size={16} />}
                            className="flex items-center"
                          >
                            Hủy đơn
                          </Button>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-2 first:pt-0 last:pb-0"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product?.image && (
                            <img
                              src={item.product.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {item.product?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(item.priceAtPurchase * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Đã xóa ConfirmPopup ở đây */}
    </div>
  );
};

export default UserProfile;
