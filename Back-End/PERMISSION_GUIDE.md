# Hướng Dẫn Phân Quyền Hệ Thống Car Rental

## Tổng Quan

Hệ thống Car Rental sử dụng phân quyền dựa trên **Role-Based Access Control (RBAC)** với **Permission-based** để quản lý quyền truy cập chi tiết.

## Cấu Trúc Phân Quyền

### 1. Roles (Vai Trò)
- **ADMIN**: Quản trị viên hệ thống
- **EMPLOYEE**: Nhân viên
- **CUSTOMER**: Khách hàng

### 2. Permissions (Quyền)
Hệ thống có các nhóm quyền chính:

#### User Management
- `USER_VIEW`: Xem thông tin người dùng
- `USER_CREATE`: Tạo người dùng mới
- `USER_UPDATE`: Cập nhật thông tin người dùng
- `USER_DELETE`: Xóa người dùng
- `USER_CHANGE_ROLE`: Thay đổi vai trò người dùng
- `USER_VIEW_ALL`: Xem tất cả người dùng

#### Vehicle Management
- `VEHICLE_VIEW`: Xem thông tin xe
- `VEHICLE_CREATE`: Tạo xe mới
- `VEHICLE_UPDATE`: Cập nhật thông tin xe
- `VEHICLE_DELETE`: Xóa xe
- `VEHICLE_SEARCH`: Tìm kiếm xe
- `VEHICLE_VIEW_ALL`: Xem tất cả xe

#### Booking Management
- `BOOKING_VIEW`: Xem thông tin đặt xe
- `BOOKING_CREATE`: Tạo đặt xe mới
- `BOOKING_UPDATE`: Cập nhật đặt xe
- `BOOKING_DELETE`: Xóa đặt xe
- `BOOKING_CONFIRM`: Xác nhận đặt xe
- `BOOKING_ACTIVATE`: Kích hoạt đặt xe
- `BOOKING_COMPLETE`: Hoàn thành đặt xe
- `BOOKING_CANCEL`: Hủy đặt xe
- `BOOKING_VIEW_ALL`: Xem tất cả đặt xe
- `BOOKING_VIEW_MY`: Xem đặt xe của mình

#### Admin Functions
- `ADMIN_DASHBOARD`: Truy cập bảng điều khiển admin
- `ADMIN_REPORTS`: Xem báo cáo
- `ADMIN_SETTINGS`: Cài đặt hệ thống
- `ADMIN_BACKUP`: Sao lưu dữ liệu

#### Employee Functions
- `EMPLOYEE_DASHBOARD`: Truy cập bảng điều khiển nhân viên
- `EMPLOYEE_BOOKING_MANAGE`: Quản lý đặt xe
- `EMPLOYEE_CUSTOMER_SUPPORT`: Hỗ trợ khách hàng

#### Customer Functions
- `CUSTOMER_PROFILE`: Quản lý hồ sơ cá nhân
- `CUSTOMER_BOOKING`: Đặt xe
- `CUSTOMER_VIEW_HISTORY`: Xem lịch sử đặt xe

## Phân Quyền Mặc Định

### ADMIN
- Có tất cả permissions trong hệ thống

### EMPLOYEE
- `EMPLOYEE_DASHBOARD`
- `EMPLOYEE_BOOKING_MANAGE`
- `EMPLOYEE_CUSTOMER_SUPPORT`
- `VEHICLE_VIEW`
- `VEHICLE_SEARCH`
- `VEHICLE_VIEW_ALL`
- `BOOKING_VIEW`
- `BOOKING_VIEW_ALL`
- `BOOKING_CONFIRM`
- `BOOKING_ACTIVATE`
- `BOOKING_COMPLETE`
- `BOOKING_CANCEL`
- `USER_VIEW`
- `CUSTOMER_PROFILE`

### CUSTOMER
- `CUSTOMER_PROFILE`
- `CUSTOMER_BOOKING`
- `CUSTOMER_VIEW_HISTORY`
- `VEHICLE_VIEW`
- `VEHICLE_SEARCH`
- `BOOKING_VIEW_MY`
- `BOOKING_CREATE`
- `BOOKING_CANCEL`

## API Quản Lý Phân Quyền

### 1. Lấy Permissions của User Hiện Tại
```http
GET /api/permissions/my-permissions
Authorization: Bearer <token>
```

### 2. Lấy Permissions của Role
```http
GET /api/permissions/role/{role}
Authorization: Bearer <admin_token>
```

### 3. Lấy Permissions theo Module
```http
GET /api/permissions/module/{module}
Authorization: Bearer <admin_token>
```

### 4. Gán Permissions cho Role
```http
POST /api/permissions/assign
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "EMPLOYEE",
  "permissions": ["VEHICLE_CREATE", "VEHICLE_UPDATE"]
}
```

### 5. Thêm Permission cho Role
```http
POST /api/permissions/add
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "EMPLOYEE",
  "permission": "VEHICLE_DELETE"
}
```

### 6. Xóa Permission khỏi Role
```http
DELETE /api/permissions/remove
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "EMPLOYEE",
  "permission": "VEHICLE_DELETE"
}
```

### 7. Khởi Tạo Permissions Mặc Định
```http
POST /api/permissions/initialize
Authorization: Bearer <admin_token>
```

### 8. Lấy Tất Cả Permissions
```http
GET /api/permissions/all
Authorization: Bearer <admin_token>
```

## Sử Dụng Trong Code

### 1. Annotation @RequirePermission
```java
@PostMapping
@RequirePermission(Permission.VEHICLE_CREATE)
public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
    // Logic tạo xe
}
```

### 2. Kiểm Tra Permission trong Service
```java
@Autowired
private PermissionService permissionService;

public void someMethod() {
    if (permissionService.hasPermission(Permission.VEHICLE_DELETE)) {
        // Thực hiện xóa xe
    } else {
        throw new AccessDeniedException("Không có quyền xóa xe");
    }
}
```

### 3. Lấy Permissions của User
```java
List<Permission> userPermissions = permissionService.getCurrentUserPermissions();
```

## Cấu Hình Database

### Bảng role_permissions
```sql
CREATE TABLE role_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    permission VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_role_permission (role, permission)
);
```

## Khởi Tạo Hệ Thống

### 1. Khởi Tạo Permissions Mặc Định
Sau khi tạo admin, gọi API:
```http
POST /api/permissions/initialize
```

### 2. Kiểm Tra Permissions
```http
GET /api/permissions/my-permissions
```

## Bảo Mật

### 1. JWT Token
- Mỗi request cần có JWT token hợp lệ
- Token chứa thông tin user và role

### 2. Permission Check
- Mỗi endpoint được bảo vệ bởi permission cụ thể
- Hệ thống tự động kiểm tra permission trước khi thực hiện

### 3. Error Handling
- Trả về HTTP 403 Forbidden khi không có quyền
- Thông báo lỗi chi tiết về permission cần thiết

## Ví Dụ Sử Dụng

### 1. Customer Đặt Xe
```http
POST /api/bookings
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "vehicleId": 1,
  "startDate": "2024-01-01T10:00:00",
  "endDate": "2024-01-03T18:00:00"
}
```

### 2. Employee Xác Nhận Đặt Xe
```http
POST /api/bookings/1/confirm
Authorization: Bearer <employee_token>
```

### 3. Admin Tạo Xe Mới
```http
POST /api/vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "brand": "Toyota",
  "model": "Camry",
  "type": "SEDAN",
  "price": 500000
}
```

## Troubleshooting

### 1. Lỗi 403 Forbidden
- Kiểm tra user có permission cần thiết không
- Kiểm tra token có hợp lệ không
- Kiểm tra role có được gán permission không

### 2. Lỗi Permission Not Found
- Kiểm tra permission có tồn tại trong enum không
- Kiểm tra spelling của permission

### 3. Lỗi Role Not Found
- Kiểm tra role có tồn tại trong enum User.Role không
- Kiểm tra spelling của role

## Mở Rộng Hệ Thống

### 1. Thêm Permission Mới
1. Thêm vào enum `Permission`
2. Cập nhật logic phân quyền
3. Gán permission cho các role phù hợp

### 2. Thêm Role Mới
1. Thêm vào enum `User.Role`
2. Tạo permissions mặc định cho role mới
3. Cập nhật logic phân quyền

### 3. Thêm Module Mới
1. Tạo permissions cho module
2. Cập nhật controller với permission checks
3. Gán permissions cho các role phù hợp
