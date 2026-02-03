# PayOS Payment Integration Setup

## Tổng quan
Hệ thống thanh toán online được tích hợp với PayOS (https://payos.vn) để xử lý thanh toán QR Code, thẻ ATM và ví điện tử.

## Cấu trúc files

### Frontend
- `src/services/paymentService.ts` - Service gọi API thanh toán
- `src/components/common/PaymentRedirect.tsx` - Xử lý redirect từ PayOS
- `src/pages/public/PaymentSuccess.tsx` - Trang thanh toán thành công
- `src/pages/public/PaymentCancel.tsx` - Trang hủy thanh toán
- `src/pages/public/Checkout.tsx` - Trang checkout với lựa chọn COD/PayOS
- `src/utils/currency.ts` - Utility format giá VND

### Supabase Edge Functions
- `supabase/functions/create-payment/index.ts` - Tạo payment request
- `supabase/functions/payos-webhook/index.ts` - Xử lý webhook từ PayOS

## Cài đặt Supabase

### 1. Thêm Secrets vào Supabase
Vào Supabase Dashboard > Project Settings > Edge Functions > Secrets:

```
PAYOS_CLIENT_ID=your_client_id
PAYOS_API_KEY=your_api_key
PAYOS_CHECKSUM_KEY=your_checksum_key
```

### 2. Deploy Edge Functions
```bash
# Login to Supabase CLI
npx supabase login

# Link project
npx supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
npx supabase functions deploy create-payment
npx supabase functions deploy payos-webhook
```

## Cấu hình PayOS Dashboard

1. Đăng ký tại https://my.payos.vn
2. Tạo channel mới
3. Lấy Client ID, API Key, Checksum Key
4. Cấu hình Return URL: `https://yoursite.com/?payment=success`
5. Cấu hình Cancel URL: `https://yoursite.com/?payment=cancel`
6. Cấu hình Webhook URL: `https://YOUR_PROJECT.supabase.co/functions/v1/payos-webhook`

## Luồng thanh toán

1. User chọn "Thanh toán online" tại Checkout
2. Frontend gọi `paymentService.createPayment()`
3. Edge Function `create-payment` gọi PayOS API
4. PayOS trả về `checkoutUrl`
5. Frontend redirect user đến PayOS checkout page
6. User thanh toán (QR/ATM/Ví)
7. PayOS redirect về app với params (`status`, `orderCode`)
8. `PaymentRedirect.tsx` detect và navigate đến `/payment/success` hoặc `/payment/cancel`

## Test

### Test Mode
PayOS cung cấp sandbox environment. Tham khảo docs tại https://payos.vn/docs

### Test Cards
- Card number: Theo hướng dẫn PayOS sandbox
- Expiry: Bất kỳ ngày valid
- CVV: Bất kỳ 3 số

## Troubleshooting

### Lỗi "Amount must be at least 1000 VND"
PayOS yêu cầu số tiền tối thiểu 1,000 VND.

### Lỗi "Signature invalid"
Kiểm tra lại PAYOS_CHECKSUM_KEY đã đúng chưa.

### Redirect không hoạt động
Kiểm tra return URL đã được cấu hình đúng trong PayOS dashboard.
