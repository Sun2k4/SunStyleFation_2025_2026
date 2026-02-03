import React, { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Eye,
  Package,
  Check,
  X,
  Truck,
  Clock,
  AlertTriangle,
} from "lucide-react";
// 1. Import message từ antd
import { message } from "antd";
import { orderService } from "../../../services/orderService";
import { Order } from "../../../types";
import { formatPrice } from "../../../utils/currency";
// Đã xóa import useToast

// Define the strict workflow steps
const ORDER_STEPS = ["pending", "processing", "shipped", "delivered"];

const AdminOrders: React.FC = () => {
  // Đã xóa hook useToast
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders", error);
      // Thay thế toast bằng message.error
      message.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);

      // Thay thế toast bằng message.success
      message.success(`Order updated: ${selectedOrder.status} ➔ ${newStatus}`);

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus as any } : o
        )
      );
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus as any } : null
      );
    } catch (error) {
      // Thay thế toast bằng message.error
      message.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Helper to determine allowed next actions based on current status
  const getAllowedActions = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return [
          {
            status: "processing",
            label: "Approve & Process",
            icon: Clock,
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            status: "cancelled",
            label: "Reject Order",
            icon: X,
            color: "bg-red-600 hover:bg-red-700",
          },
        ];
      case "processing":
        return [
          {
            status: "shipped",
            label: "Ship Order",
            icon: Truck,
            color: "bg-purple-600 hover:bg-purple-700",
          },
          {
            status: "cancelled",
            label: "Cancel Order",
            icon: X,
            color: "bg-red-600 hover:bg-red-700",
          },
        ];
      case "shipped":
        return [
          {
            status: "delivered",
            label: "Confirm Delivery",
            icon: Check,
            color: "bg-green-600 hover:bg-green-700",
          },
        ];
      case "delivered":
        return []; // Terminal state
      case "cancelled":
        return []; // Terminal state
      default:
        return [];
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      order.userInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userInfo?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Track and manage customer orders</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, Customer Name, Email..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {["all", ...ORDER_STEPS, "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border capitalize ${filterStatus === status
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {order.userInfo?.name || "Guest"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.userInfo?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(order.date).toLocaleDateString()}
                        <div className="text-xs text-gray-400">
                          {new Date(order.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-primary-600 hover:text-primary-700 font-medium text-xs flex items-center justify-end gap-1 ml-auto"
                        >
                          <Eye size={14} /> Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p>No orders found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Order Management Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedOrder(null)}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full animate-fade-in-up">
              <div className="bg-white p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Manage Order #{selectedOrder.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(selectedOrder.date).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Progress Stepper */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    Order Progress
                  </h4>
                  {selectedOrder.status === "cancelled" ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                      <AlertTriangle size={24} />
                      <div>
                        <p className="font-bold">Order Cancelled</p>
                        <p className="text-sm">
                          This order has been cancelled and cannot be processed
                          further.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                        {ORDER_STEPS.map((step, index) => {
                          const currentIndex = ORDER_STEPS.indexOf(
                            selectedOrder.status
                          );
                          const stepIndex = ORDER_STEPS.indexOf(step);
                          const isCompleted = stepIndex <= currentIndex;

                          return (
                            <div
                              key={step}
                              style={{ width: "25%" }}
                              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${isCompleted
                                ? "bg-primary-500"
                                : "bg-transparent"
                                }`}
                            ></div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm font-medium text-gray-600">
                        {ORDER_STEPS.map((step, index) => {
                          const currentIndex = ORDER_STEPS.indexOf(
                            selectedOrder.status
                          );
                          const stepIndex = ORDER_STEPS.indexOf(step);
                          const isActive = stepIndex === currentIndex;
                          const isCompleted = stepIndex <= currentIndex;

                          return (
                            <div
                              key={step}
                              className={`text-center w-1/4 ${isActive
                                ? "text-primary-600 font-bold"
                                : isCompleted
                                  ? "text-gray-900"
                                  : "text-gray-400"
                                }`}
                            >
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Left Column: Customer & Items */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                        Customer Info
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm border border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name:</span>
                          <span className="font-medium text-gray-900">
                            {selectedOrder.userInfo?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium text-gray-900">
                            {selectedOrder.userInfo?.email}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">User ID:</span>
                          <span className="font-mono text-xs text-gray-600 truncate max-w-[120px]">
                            {selectedOrder.userId}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                        Order Items
                      </h4>
                      <div className="border border-gray-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-gray-50 text-gray-700 sticky top-0">
                            <tr>
                              <th className="px-3 py-2 font-medium">Item</th>
                              <th className="px-3 py-2 font-medium text-center">
                                Qty
                              </th>
                              <th className="px-3 py-2 font-medium text-right">
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {selectedOrder.items?.map((item) => (
                              <tr key={item.id}>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={item.product?.image}
                                      alt=""
                                      className="w-8 h-8 rounded object-cover bg-gray-100"
                                    />
                                    <span className="font-medium text-gray-900 line-clamp-1">
                                      {item.product?.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item.quantity}
                                </td>
                                <td className="px-3 py-2 text-right font-medium text-gray-900">
                                  {formatPrice(item.priceAtPurchase * item.quantity)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex justify-between items-center mt-3 px-2">
                        <span className="font-bold text-gray-700">
                          Total Amount
                        </span>
                        <span className="font-bold text-xl text-primary-600">
                          {formatPrice(selectedOrder.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                      Workflow Actions
                    </h4>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-full flex flex-col justify-center">
                      <div className="text-center mb-6">
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(
                            selectedOrder.status
                          )}`}
                        >
                          Current Status: <span className="capitalize">{selectedOrder.status}</span>
                        </span>
                      </div>

                      <div className="space-y-3">
                        {getAllowedActions(selectedOrder.status).map(
                          (action) => (
                            <button
                              key={action.status}
                              onClick={() => handleStatusUpdate(action.status)}
                              disabled={isUpdating}
                              className={`w-full py-3 px-4 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
                            >
                              {isUpdating ? (
                                <Loader2 className="animate-spin" size={20} />
                              ) : (
                                <action.icon size={20} />
                              )}
                              {action.label}
                            </button>
                          )
                        )}

                        {getAllowedActions(selectedOrder.status).length ===
                          0 && (
                            <div className="text-center text-gray-500 py-4">
                              <Check className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                              <p>No further actions available for this order.</p>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
