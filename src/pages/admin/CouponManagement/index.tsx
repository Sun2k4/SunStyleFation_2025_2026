import React, { useEffect, useState } from "react";
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Loader2,
    X,
    Save,
    Tag,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { Popconfirm, message } from "antd";
import { couponService } from "../../../services/couponService";
import { Coupon } from "../../../types";
import { formatPrice } from "../../../utils/currency";

const CouponManagement: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Form State
    const initialFormState = {
        code: "",
        discount_type: "percentage" as "percentage" | "fixed",
        discount_value: "",
        min_order_amount: "",
        max_discount: "",
        usage_limit: "",
        start_date: "",
        end_date: "",
        is_active: true,
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        setLoading(true);
        try {
            const data = await couponService.getAllCoupons();
            setCoupons(data);
        } catch (error) {
            console.error("Failed to load coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await couponService.deleteCoupon(id);
            message.success("Đã xóa mã giảm giá");
            loadCoupons();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    const handleToggleActive = async (id: number, currentActive: boolean | null) => {
        try {
            await couponService.toggleCouponActive(id, !currentActive);
            message.success(currentActive ? "Đã vô hiệu hóa" : "Đã kích hoạt");
            loadCoupons();
        } catch (error) {
            message.error("Cập nhật thất bại");
        }
    };

    const handleOpenAddModal = () => {
        setEditingId(null);
        setFormData(initialFormState);
        setIsModalOpen(true);
    };

    const handleEdit = (coupon: Coupon) => {
        setEditingId(coupon.id);
        setFormData({
            code: coupon.code,
            discount_type: coupon.discount_type as "percentage" | "fixed",
            discount_value: coupon.discount_value.toString(),
            min_order_amount: coupon.min_order_amount?.toString() || "",
            max_discount: coupon.max_discount?.toString() || "",
            usage_limit: coupon.usage_limit?.toString() || "",
            start_date: coupon.start_date ? coupon.start_date.slice(0, 16) : "",
            end_date: coupon.end_date ? coupon.end_date.slice(0, 16) : "",
            is_active: coupon.is_active ?? true,
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!formData.code || !formData.discount_value) {
                message.warning("Mã và giá trị giảm là bắt buộc");
                return;
            }

            const payload = {
                code: formData.code.toUpperCase().trim(),
                discount_type: formData.discount_type,
                discount_value: parseFloat(formData.discount_value),
                min_order_amount: formData.min_order_amount
                    ? parseFloat(formData.min_order_amount)
                    : 0,
                max_discount: formData.max_discount
                    ? parseFloat(formData.max_discount)
                    : null,
                usage_limit: formData.usage_limit
                    ? parseInt(formData.usage_limit)
                    : null,
                start_date: formData.start_date
                    ? new Date(formData.start_date).toISOString()
                    : null,
                end_date: formData.end_date
                    ? new Date(formData.end_date).toISOString()
                    : null,
                is_active: formData.is_active,
            };

            if (editingId) {
                await couponService.updateCoupon(editingId, payload);
                message.success("Cập nhật thành công");
            } else {
                await couponService.createCoupon(payload as any);
                message.success("Tạo mã giảm giá thành công");
            }

            handleCloseModal();
            loadCoupons();
        } catch (error: any) {
            if (error?.code === "23505") {
                message.error("Mã giảm giá này đã tồn tại");
            } else {
                message.error("Lưu thất bại");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCoupons = coupons.filter((c) =>
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDiscountDisplay = (coupon: Coupon) => {
        if (coupon.discount_type === "percentage") {
            return `${coupon.discount_value}%`;
        }
        return formatPrice(coupon.discount_value);
    };

    const isExpired = (coupon: Coupon) => {
        if (!coupon.end_date) return false;
        return new Date(coupon.end_date) < new Date();
    };

    const isUsedUp = (coupon: Coupon) => {
        if (!coupon.usage_limit) return false;
        return (coupon.used_count || 0) >= coupon.usage_limit;
    };

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
                    <p className="text-gray-500">Quản lý coupon/voucher</p>
                </div>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Thêm mã
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm mã giảm giá..."
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Mã</th>
                                <th className="px-6 py-4 whitespace-nowrap">Giảm giá</th>
                                <th className="px-6 py-4 whitespace-nowrap">Đơn tối thiểu</th>
                                <th className="px-6 py-4 whitespace-nowrap">Đã dùng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading
                                ? Array.from({ length: 4 }).map((_, index) => (
                                    <tr key={`skeleton-${index}`}>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded w-16 animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded w-12 animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="h-6 bg-gray-100 rounded-full w-16 animate-pulse" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                                                <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                                : filteredCoupons.map((coupon) => (
                                    <tr
                                        key={coupon.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Tag size={16} className="text-primary-500" />
                                                <span className="font-bold text-gray-900 font-mono">
                                                    {coupon.code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                                                {formatDiscountDisplay(coupon)}
                                            </span>
                                            {coupon.discount_type === "percentage" &&
                                                coupon.max_discount && (
                                                    <span className="text-xs text-gray-400 ml-1">
                                                        (tối đa {formatPrice(coupon.max_discount)})
                                                    </span>
                                                )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {coupon.min_order_amount
                                                ? formatPrice(coupon.min_order_amount)
                                                : "—"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`font-medium ${isUsedUp(coupon) ? "text-red-600" : "text-gray-700"
                                                    }`}
                                            >
                                                {coupon.used_count || 0}
                                                {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {isExpired(coupon) ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                                    Hết hạn
                                                </span>
                                            ) : isUsedUp(coupon) ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                                                    Hết lượt
                                                </span>
                                            ) : coupon.is_active ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                                    Đang hoạt động
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                    Vô hiệu hóa
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(coupon.id, coupon.is_active)
                                                    }
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-primary-600 transition-colors"
                                                    title={
                                                        coupon.is_active ? "Vô hiệu hóa" : "Kích hoạt"
                                                    }
                                                >
                                                    {coupon.is_active ? (
                                                        <ToggleRight size={16} className="text-green-600" />
                                                    ) : (
                                                        <ToggleLeft size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(coupon)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <Popconfirm
                                                    title="Xóa mã giảm giá"
                                                    description={`Bạn chắc chắn muốn xóa mã "${coupon.code}"?`}
                                                    onConfirm={() => handleDelete(coupon.id)}
                                                    okText="Xóa"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ danger: true }}
                                                >
                                                    <button
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            {!loading && filteredCoupons.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
                                        Không tìm thấy mã giảm giá nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={handleCloseModal}
                        ></div>

                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3
                                        className="text-lg leading-6 font-bold text-gray-900"
                                        id="modal-title"
                                    >
                                        {editingId ? "Sửa mã giảm giá" : "Thêm mã giảm giá"}
                                    </h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mã coupon
                                            </label>
                                            <input
                                                type="text"
                                                name="code"
                                                required
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                placeholder="VD: SALE20"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none uppercase font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Loại giảm
                                            </label>
                                            <select
                                                name="discount_type"
                                                value={formData.discount_type}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                                            >
                                                <option value="percentage">Phần trăm (%)</option>
                                                <option value="fixed">Số tiền cố định (₫)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giá trị giảm{" "}
                                                {formData.discount_type === "percentage" ? "(%)" : "(₫)"}
                                            </label>
                                            <input
                                                type="number"
                                                name="discount_value"
                                                required
                                                min="0"
                                                step={formData.discount_type === "percentage" ? "1" : "1000"}
                                                value={formData.discount_value}
                                                onChange={handleInputChange}
                                                placeholder={
                                                    formData.discount_type === "percentage" ? "20" : "50000"
                                                }
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Đơn tối thiểu (₫)
                                            </label>
                                            <input
                                                type="number"
                                                name="min_order_amount"
                                                min="0"
                                                step="1000"
                                                value={formData.min_order_amount}
                                                onChange={handleInputChange}
                                                placeholder="100000"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {formData.discount_type === "percentage" && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Giảm tối đa (₫)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="max_discount"
                                                    min="0"
                                                    step="1000"
                                                    value={formData.max_discount}
                                                    onChange={handleInputChange}
                                                    placeholder="50000"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giới hạn lượt dùng
                                            </label>
                                            <input
                                                type="number"
                                                name="usage_limit"
                                                min="0"
                                                value={formData.usage_limit}
                                                onChange={handleInputChange}
                                                placeholder="Không giới hạn"
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày bắt đầu
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày kết thúc
                                            </label>
                                            <input
                                                type="datetime-local"
                                                name="end_date"
                                                value={formData.end_date}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                        />
                                        <label
                                            htmlFor="is_active"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Kích hoạt ngay
                                        </label>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-primary-500 text-white rounded-lg px-4 py-3 font-bold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="animate-spin" size={20} />
                                            ) : (
                                                <>
                                                    <Save size={20} />
                                                    {editingId ? "Cập nhật" : "Tạo mã giảm giá"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManagement;
