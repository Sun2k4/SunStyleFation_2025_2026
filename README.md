<div align="center">

# 🛍️ SunStyle Fashion Store

**Nền tảng thương mại điện tử thời trang** — Khóa luận tốt nghiệp

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.87-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Vitest](https://img.shields.io/badge/Vitest-10%20tests-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

</div>

---

## 📖 Giới thiệu

SunStyle Fashion Store là ứng dụng web thương mại điện tử chuyên về thời trang, được xây dựng với React + TypeScript. Dự án cung cấp trải nghiệm mua sắm hoàn chỉnh từ duyệt sản phẩm, quản lý giỏ hàng, thanh toán trực tuyến (PayOS), đến quản trị hệ thống với dashboard dành cho admin.

### ✨ Điểm nổi bật
- 🤖 **AI Stylist Chatbot** — Tư vấn thời trang thông minh bằng Gemini AI
- 💳 **Thanh toán PayOS** — Tích hợp cổng thanh toán trực tuyến Việt Nam
- 🌐 **Đa ngôn ngữ** — Hỗ trợ tiếng Việt và tiếng Anh (i18next)
- 🛡️ **Bảo mật** — Row Level Security (RLS) trên Supabase + phân quyền frontend
- ⚡ **Code Splitting** — React.lazy cho 17 pages, tối ưu tốc độ tải

---

## 🚀 Tính năng

### 👤 Khách hàng
| Tính năng | Mô tả |
|-----------|-------|
| 🏠 Trang chủ | Banner, sản phẩm nổi bật, danh mục |
| 🔍 Cửa hàng | Lọc theo danh mục, tìm kiếm, sắp xếp |
| 📦 Chi tiết sản phẩm | Ảnh gallery, chọn size/màu, đánh giá |
| 🛒 Giỏ hàng | Thêm/xóa/cập nhật số lượng |
| ❤️ Wishlist | Lưu sản phẩm yêu thích |
| 💳 Thanh toán | Nhập địa chỉ → Chọn phương thức → PayOS |
| 👤 Hồ sơ | Quản lý thông tin cá nhân, lịch sử đơn hàng |
| 🤖 AI Chat | Tư vấn phong cách thời trang bằng Gemini |

### 🔧 Admin
| Tính năng | Mô tả |
|-----------|-------|
| 📊 Dashboard | Thống kê doanh thu, đơn hàng, biểu đồ (Recharts) |
| 📦 Sản phẩm | CRUD sản phẩm + quản lý biến thể (size, màu) |
| 📂 Danh mục | Quản lý danh mục sản phẩm |
| 👥 Người dùng | Quản lý tài khoản khách hàng |
| 📋 Đơn hàng | Xem, cập nhật trạng thái đơn hàng |
| 🗄️ Database | Tiện ích quản lý cơ sở dữ liệu |

---

## 🛠️ Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 19, TypeScript 5.8, Vite 6 |
| **UI** | Ant Design 6, TailwindCSS, Lucide Icons |
| **State** | React Context (Auth, Cart, Wishlist) |
| **Routing** | React Router v7 (BrowserRouter + lazy loading) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + RLS) |
| **AI** | Google Gemini (`gemini-2.5-flash`) |
| **Payment** | PayOS |
| **i18n** | i18next + Browser Language Detector |
| **Charts** | Recharts |
| **Testing** | Vitest, React Testing Library, jsdom |
| **Build** | Vite, PostCSS, Autoprefixer |

---

## 📁 Cấu trúc dự án

```
src/
├── components/          # UI components tái sử dụng
│   ├── common/          #   ErrorBoundary, PaymentRedirect, ...
│   └── user/            #   ProductCard, Header, Footer, ...
├── context/             # Global state management
│   ├── AuthContext.tsx   #   Authentication + session
│   ├── CartContext.tsx   #   Shopping cart
│   └── WishlistContext.tsx # Danh sách yêu thích
├── layouts/             # Page layouts
│   ├── MainLayout.tsx   #   Layout cho khách hàng
│   ├── AdminLayout.tsx  #   Layout cho admin
│   └── AuthLayout.tsx   #   Layout cho đăng nhập
├── pages/               # Page components (lazy-loaded)
│   ├── public/          #   Home, Shop, Cart, Checkout, ...
│   ├── auth/            #   UserLogin, AdminLogin
│   └── admin/           #   Dashboard, Products, Orders, ...
├── routes/              # Routing + Guards
│   ├── AppRoutes.tsx    #   Route definitions + Suspense
│   └── ProtectedRoute.tsx # Auth + role-based guard
├── services/            # Data access layer
│   ├── supabaseClient.ts #  Supabase client (env vars)
│   ├── productService.ts #  Product CRUD
│   ├── cartService.ts   #   Cart operations
│   ├── orderService.ts  #   Order management
│   └── ...              #   Other services
├── tests/               # Test infrastructure
│   ├── setup.ts         #   Jest-dom matchers
│   └── mocks/           #   Supabase mock (reusable)
├── types/               # TypeScript interfaces
├── utils/               # Utilities
│   └── placeholderImage.ts # Branded image fallback
└── i18n/                # Internationalization config
```

---

## ⚙️ Cài đặt & Chạy

### Yêu cầu
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. Clone repository

```bash
git clone https://github.com/Sun2k4/SunStyleFation_2025_2026.git
cd SunStyleFation_2025_2026
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` tại thư mục gốc:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Chạy ứng dụng

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run preview      # Preview production build
```

### 5. Chạy tests

```bash
npm test             # Chạy tất cả unit tests
npm run test:watch   # Chạy tests ở chế độ watch
```

---

## 🧪 Testing

Dự án sử dụng **Vitest** với **React Testing Library** để kiểm thử:

| File test | Số tests | Kiểm tra |
|-----------|:--------:|----------|
| `productService.test.ts` | 3 | Fetch products, error handling, fetch by ID |
| `cartService.test.ts` | 3 | Add to cart, get items, remove item |
| `categoryService.test.ts` | 2 | Fetch categories, empty result |
| `placeholderImage.test.ts` | 2 | SVG data URI, error handler |
| **Tổng** | **10** | **All passing ✅** |

```
 ✓ src/utils/placeholderImage.test.ts (2 tests) 4ms
 ✓ src/services/categoryService.test.ts (2 tests) 8ms
 ✓ src/services/cartService.test.ts (3 tests) 9ms
 ✓ src/services/productService.test.ts (3 tests) 12ms

 Test Files  4 passed (4)
      Tests  10 passed (10)
```

---

## 🗄️ Cơ sở dữ liệu

Sử dụng **Supabase (PostgreSQL)** với 12 bảng chính:

```
users, products, categories, product_variants,
cart_items, orders, order_items, reviews,
wishlists, payments, addresses, coupons
```

Bảo mật bằng **Row Level Security (RLS)** — mỗi user chỉ truy cập được dữ liệu của chính mình.

---

## 📄 License

Dự án phục vụ mục đích học tập — Khóa luận tốt nghiệp.

---

<div align="center">

**SunStyle Fashion Store** — Built with ❤️ by [Sun2k4](https://github.com/Sun2k4)

</div>
