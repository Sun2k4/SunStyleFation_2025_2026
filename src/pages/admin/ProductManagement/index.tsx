import React, { useEffect, useState, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  Layers,
} from "lucide-react";
import { Popconfirm, message } from "antd";
import { productService } from "../../../services/productService";
import { categoryService } from "../../../services/categoryService";
import { Product, Category } from "../../../types";
import VariantModal from "../../../components/admin/VariantModal";
import { formatPrice } from '../../../utils/currency';
import { PLACEHOLDER_IMAGE, handleImageError } from '../../../utils/placeholderImage';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. STATE MỚI: Lưu ID sản phẩm đang sửa (null = đang thêm mới)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Variant Modal State
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState<Product | null>(null);

  const openVariantModal = (product: Product) => {
    setSelectedProductForVariants(product);
    setVariantModalOpen(true);
  };

  // Form State
  const initialFormState = {
    name: "",
    category_id: categories.length > 0 ? categories[0].id : 0,
    price: "",
    stock: "",
    image: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories")
    }
  }

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await productService.deleteProduct(id);
      message.success("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Delete failed", error);
      message.error("Failed to delete product");
    }
  };

  // 2. LOGIC MỞ MODAL ĐỂ THÊM MỚI (Reset form)
  const handleOpenAddModal = () => {
    setEditingId(null); // Đảm bảo không phải chế độ Edit
    setFormData(initialFormState);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  // 3. LOGIC MỞ MODAL ĐỂ SỬA (Đổ dữ liệu cũ vào form)
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category_id: product.category_id || 0,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image || "",
      description: product.description || "",
    });
    setPreviewUrl(product.image || null);
    setSelectedFile(null); // Reset file upload mới
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null); // Reset trạng thái khi đóng
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  // 4. LOGIC SUBMIT (TỰ ĐỘNG CHỌN CREATE HOẶC UPDATE)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.name || !formData.price) {
        message.warning("Tên sản phẩm và Giá là bắt buộc");
        return;
      }

      // Price validation: minimum 1000 VND
      if (formData.price < 1000) {
        message.warning("Giá sản phẩm tối thiểu là 1,000₫");
        return;
      }

      let finalImageUrl = formData.image;

      if (selectedFile) {
        try {
          finalImageUrl = await productService.uploadImage(selectedFile);
        } catch (uploadError) {
          console.error("Upload failed", uploadError);
          message.error("Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }

      if (!finalImageUrl && !editingId) {
        // Nếu thêm mới mà không có ảnh thì lấy ảnh mặc định
        finalImageUrl = PLACEHOLDER_IMAGE;
      }

      // Payload chung
      const productPayload = {
        name: formData.name,
        category_id: formData.category_id,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        image: finalImageUrl,
        description: formData.description,
        slug: formData.name.toLowerCase().replace(/ /g, "-"),
        // Các trường này có thể giữ nguyên hoặc xử lý tùy backend
        isNew: true,
      };

      if (editingId) {
        // --- UPDATE ---
        // Lưu ý: Bạn cần đảm bảo productService có hàm updateProduct
        await productService.updateProduct(editingId, productPayload);
        message.success("Product updated successfully");
      } else {
        // --- CREATE ---
        await productService.createProduct({
          ...productPayload,
          rating: 0,
          reviews: 0,
          images: [],
        } as any);
        message.success("Product created successfully");
      }

      handleCloseModal();
      loadProducts();
    } catch (error) {
      console.error("Failed to save product", error);
      message.error("Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6
    ; // Adjust items per page here

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your inventory</p>
        </div>
        <button
          onClick={handleOpenAddModal} // Đổi hàm gọi ở đây
          className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto min-h-[400px]"> {/* Set min-height to prevent jump */}
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-full">Product</th>
                <th className="px-6 py-4 whitespace-nowrap min-w-[140px]">Category</th>
                <th className="px-6 py-4 whitespace-nowrap min-w-[120px]">Price</th>
                <th className="px-6 py-4 whitespace-nowrap min-w-[100px]">Stock</th>
                <th className="px-6 py-4 text-right whitespace-nowrap min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                // Skeleton Loading Rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded w-32 animate-pulse" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 w-8 bg-gray-100 rounded animate-pulse" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                        <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Actual Data Rows
                currentProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            product.image || PLACEHOLDER_IMAGE
                          }
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          onError={handleImageError}
                        />
                        <span className="font-medium text-gray-900">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                        {product.categoryName || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 ${product.stock < 20
                          ? "text-red-600"
                          : "text-green-600"
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${product.stock < 20 ? "bg-red-600" : "bg-green-600"
                            }`}
                        ></span>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* 5. GẮN SỰ KIỆN NÚT EDIT */}
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 size={16} />
                        </button>

                        {/* Variants Button */}
                        <button
                          onClick={() => openVariantModal(product)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-purple-600 transition-colors"
                          title="Manage Variants"
                        >
                          <Layers size={16} />
                        </button>

                        <Popconfirm
                          title="Delete Product"
                          description={`Are you sure you want to delete "${product.name}"?`}
                          onConfirm={() => handleDelete(product.id)}
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ danger: true }}
                        >
                          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-red-600 transition-colors" title="Delete Product">
                            <Trash2 size={16} />
                          </button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                )))}
              {!loading && filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-500">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Logic to show limited page numbers: First, Last, Current, and adjacent
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 py-1 text-gray-400">...</span>}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-xs font-medium rounded-md border ${currentPage === page
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>

      </div>

      {/* Modal Form */}
      {
        isModalOpen && (
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
                      {/* 6. ĐỔI TIÊU ĐỀ MODAL */}
                      {editingId ? "Edit Product" : "Add New Product"}
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Category
                        </label>
                        <select
                          name="category_id"
                          id="category_id"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-white"
                          value={formData.category_id}
                          onChange={handleInputChange}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Price ($)
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          required
                          min="0"
                          step="0.01"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          value={formData.price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="stock"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="stock"
                        min="0"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        value={formData.stock}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                      </label>
                      <div className="space-y-3">
                        {/* Upload Button */}
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                          >
                            <Upload size={16} />
                            Upload from Computer
                          </button>
                          <span className="text-xs text-gray-500">OR</span>
                        </div>

                        {/* URL Input */}
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ImageIcon size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="image"
                            id="image"
                            placeholder="Paste image URL here..."
                            className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            value={formData.image}
                            onChange={(e) => {
                              handleInputChange(e);
                              setPreviewUrl(e.target.value);
                              setSelectedFile(null);
                            }}
                          />
                        </div>

                        {/* Preview Area */}
                        {(previewUrl || formData.image) && (
                          <div className="mt-2 w-full h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                            <img
                              src={previewUrl || formData.image}
                              alt="Preview"
                              className="h-full object-contain"
                              onError={handleImageError}
                            />
                            {selectedFile && (
                              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                Uploading: {selectedFile.name}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                        value={formData.description}
                        onChange={handleInputChange}
                      ></textarea>
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
                            {/* 7. ĐỔI TEXT BUTTON */}
                            <Save size={20} />{" "}
                            {editingId ? "Update Product" : "Save Product"}
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {/* Variant Modal */}
      <VariantModal
        product={selectedProductForVariants}
        isOpen={variantModalOpen}
        onClose={() => {
          setVariantModalOpen(false);
          setSelectedProductForVariants(null);
        }}
        onUpdate={loadProducts}
      />
    </div>
  );
};

export default AdminProducts;
