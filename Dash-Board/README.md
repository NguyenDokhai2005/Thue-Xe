# Car Rental Dashboard

Dashboard quản lý thuê xe sử dụng React + TypeScript + Vite

## Tính năng

- ✅ Đăng nhập / Đăng ký
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý xe (xem, thêm, sửa, xóa) - chỉ Admin
- ✅ Quản lý đặt xe (tạo, xác nhận, kích hoạt, hoàn thành, hủy)
- ✅ Tìm kiếm và lọc xe
- ✅ Giao diện hiện đại với Tailwind CSS

## Cài đặt

1. Cài đặt dependencies:
```bash
cd Font-End
npm install
```

2. Chạy development server:
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu hình

Backend API mặc định: `http://localhost:8080`

Có thể thay đổi trong file `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Cấu trúc dự án

```
Font-End/
├── src/
│   ├── components/      # Components tái sử dụng
│   │   ├── Layout.tsx
│   │   ├── VehicleModal.tsx
│   │   └── BookingModal.tsx
│   ├── contexts/        # React Contexts
│   │   └── AuthContext.tsx
│   ├── pages/           # Các trang chính
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Vehicles.tsx
│   │   └── Bookings.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API Endpoints sử dụng

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Vehicles
- `GET /api/vehicles` - Lấy danh sách xe
- `GET /api/vehicles/{id}` - Lấy thông tin xe
- `POST /api/vehicles` - Tạo xe mới (Admin)
- `PUT /api/vehicles/{id}` - Cập nhật xe (Admin)
- `DELETE /api/vehicles/{id}` - Xóa xe (Admin)

### Bookings
- `POST /api/bookings` - Tạo đặt xe
- `GET /api/bookings/me` - Lấy đặt xe của tôi
- `POST /api/bookings/{id}/confirm` - Xác nhận đặt xe (Admin/Employee)
- `POST /api/bookings/{id}/activate` - Kích hoạt đặt xe (Admin/Employee)
- `POST /api/bookings/{id}/complete` - Hoàn thành đặt xe (Admin/Employee)
- `POST /api/bookings/{id}/cancel` - Hủy đặt xe

## Quyền truy cập

- **ADMIN**: Toàn quyền (quản lý xe, quản lý đặt xe)
- **EMPLOYEE**: Quản lý đặt xe (xác nhận, kích hoạt, hoàn thành)
- **CUSTOMER**: Xem xe, tạo đặt xe, xem đặt xe của mình

## Build cho production

```bash
npm run build
```

Files sẽ được build vào thư mục `dist/`

