## Hướng dẫn test API tìm kiếm phương tiện

Tài liệu này hướng dẫn test 3 API tìm kiếm tách biệt: theo giá, theo loại xe, và theo ngày khả dụng.

### Yêu cầu trước khi test
- Server chạy tại: `http://localhost:8080`
- Database `car-rental` đã tạo và có dữ liệu
- Nếu bảo mật yêu cầu đăng nhập cho `/api/vehicles/**`, thêm JWT hợp lệ:
  - Header: `Authorization: Bearer <token_cua_ban>`

Với curl, thêm header bằng: `-H "Authorization: Bearer <token_cua_ban>"` (bỏ qua nếu không cần).

---

### 1) Tìm theo giá
- Endpoint: `GET /api/vehicles/search/by-price`
- Tham số (tuỳ chọn):
  - `minPrice`: giá thuê theo ngày thấp nhất (số thập phân)
  - `maxPrice`: giá thuê theo ngày cao nhất (số thập phân)

Ví dụ:
```bash
curl -s "http://localhost:8080/api/vehicles/search/by-price?minPrice=200000&maxPrice=700000"

curl -s "http://localhost:8080/api/vehicles/search/by-price?minPrice=300000"

curl -s "http://localhost:8080/api/vehicles/search/by-price?maxPrice=500000"
```

Kết quả: Mảng JSON các `VehicleResponse`.

---

### 2) Tìm theo loại xe
- Endpoint: `GET /api/vehicles/search/by-type`
- Tham số (bắt buộc):
  - `type`: một trong `SEDAN`, `SUV`, `HATCHBACK`, `COUPE`, `CONVERTIBLE`, `WAGON`, `PICKUP`, `VAN`, `MOTORCYCLE`

Ví dụ:
```bash
curl -s "http://localhost:8080/api/vehicles/search/by-type?type=SUV"
```

---

### 3) Tìm theo ngày khả dụng
- Endpoint: `GET /api/vehicles/search/by-date`
- Trả về các xe KHÔNG có booking chồng lấn trong khoảng thời gian yêu cầu (kiểm tra trạng thái `CONFIRMED` và `ACTIVE`).
- Tham số (bắt buộc):
  - `startAt`: thời gian bắt đầu theo ISO-8601, ví dụ `2025-10-20T09:00:00`
  - `endAt`: thời gian kết thúc theo ISO-8601, ví dụ `2025-10-22T10:00:00`

Ví dụ:
```bash
curl -s "http://localhost:8080/api/vehicles/search/by-date?startAt=2025-10-20T09:00:00&endAt=2025-10-22T10:00:00"
```

Ghi chú:
- Múi giờ: nếu không chỉ định, server hiểu theo múi giờ hệ thống. Nên thống nhất (ví dụ UTC).
- Quy tắc chồng lấn: `startAt < booking.endAt && endAt > booking.startAt`.

---

### API kết hợp cũ (tuỳ chọn)
- Endpoint: `GET /api/vehicles/search`
- Tham số (tuỳ chọn): `type`, `minPrice`, `maxPrice`

Ví dụ:
```bash
curl -s "http://localhost:8080/api/vehicles/search?type=SEDAN&minPrice=200000&maxPrice=800000"
```

---

### Mẫu phản hồi thành công
```json
[
  {
    "id": 1,
    "title": "Toyota Vios",
    "vehicleType": "SEDAN",
    "licensePlate": "30A-123.45",
    "dailyPrice": 400000,
    "currency": "VND",
    "status": "AVAILABLE",
    "description": "..."
  }
]
```

### Xử lý lỗi thường gặp
- 401 Unauthorized: thêm header JWT `Authorization` hoặc mở quyền trong `SecurityConfig`.
- 400 Bad Request: kiểm tra giá trị enum `type`, định dạng số; thời gian đúng ISO-8601.
- Kết quả rỗng: không có xe phù hợp hoặc tất cả đã được đặt trong khoảng thời gian truy vấn.


