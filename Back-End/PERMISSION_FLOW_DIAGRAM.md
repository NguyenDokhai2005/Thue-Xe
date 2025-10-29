# Luồng Phân Quyền Hệ Thống Car Rental

## 🎯 Tổng Quan Luồng Phân Quyền

```
User Request → Authentication → Authorization → Permission Check → Action
     ↓              ↓              ↓              ↓           ↓
   Login        JWT Token    Role Check    Permission   Execute
   Request      Validation    (ADMIN/      Validation   Business
                            EMPLOYEE/      (VEHICLE_    Logic
                            CUSTOMER)      CREATE, etc.)
```

## 🔐 1. Luồng Xác Thực (Authentication Flow)

### 1.1 User Đăng Nhập
```
POST /api/auth/login
{
  "username": "customer1",
  "password": "password123"
}
```

**Luồng xử lý:**
1. **AuthController.login()** nhận request
2. **UserService.login()** xác thực thông tin
3. **JwtUtil.generateToken()** tạo JWT token
4. **Trả về token** cho client

### 1.2 JWT Token Validation
```
Authorization: Bearer <jwt_token>
```

**Luồng xử lý:**
1. **JwtAuthenticationFilter** intercept request
2. **JwtUtil.validateToken()** kiểm tra token
3. **UserService.loadUserByUsername()** load user info
4. **SecurityContext** lưu thông tin user

## 🛡️ 2. Luồng Phân Quyền (Authorization Flow)

### 2.1 Endpoint Protection
```java
@PostMapping("/vehicles")
@RequirePermission(Permission.VEHICLE_CREATE)
public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
    // Business logic
}
```

**Luồng xử lý:**
1. **PermissionAspect** intercept method call
2. **PermissionService.hasPermission()** kiểm tra quyền
3. **RolePermissionRepository** query database
4. **Cho phép/Từ chối** dựa trên kết quả

### 2.2 Permission Check Process
```
User Request → @RequirePermission → PermissionAspect → PermissionService
     ↓              ↓                    ↓              ↓
  Extract      Extract Permission    Check User      Query Database
  User Info    from Annotation      Role &          for Role-Permission
                              Permission Match
```

## 📋 3. Các Luồng Phân Quyền Cụ Thể

### 3.1 Luồng Quản Lý Xe (Vehicle Management)

#### 3.1.1 Xem Danh Sách Xe
```
GET /api/vehicles
Authorization: Bearer <token>
```

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate token
2. **PermissionAspect** → Check VEHICLE_VIEW permission
3. **PermissionService.hasPermission()** → Query role_permissions table
4. **VehicleController.listVehicles()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có VEHICLE_VIEW
- **EMPLOYEE**: ✅ Có VEHICLE_VIEW  
- **CUSTOMER**: ✅ Có VEHICLE_VIEW

#### 3.1.2 Tạo Xe Mới
```
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

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate admin token
2. **PermissionAspect** → Check VEHICLE_CREATE permission
3. **PermissionService.hasPermission()** → Check if ADMIN has VEHICLE_CREATE
4. **VehicleController.create()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có VEHICLE_CREATE
- **EMPLOYEE**: ❌ Không có VEHICLE_CREATE
- **CUSTOMER**: ❌ Không có VEHICLE_CREATE

#### 3.1.3 Tìm Kiếm Xe
```
GET /api/vehicles/search?type=SEDAN&minPrice=300000
Authorization: Bearer <token>
```

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate token
2. **PermissionAspect** → Check VEHICLE_SEARCH permission
3. **PermissionService.hasPermission()** → Query database
4. **VehicleController.searchVehicles()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có VEHICLE_SEARCH
- **EMPLOYEE**: ✅ Có VEHICLE_SEARCH
- **CUSTOMER**: ✅ Có VEHICLE_SEARCH

### 3.2 Luồng Quản Lý Đặt Xe (Booking Management)

#### 3.2.1 Khách Hàng Đặt Xe
```
POST /api/bookings
Authorization: Bearer <customer_token>
Content-Type: application/json
{
  "vehicleId": 1,
  "startDate": "2024-01-01T10:00:00",
  "endDate": "2024-01-03T18:00:00"
}
```

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate customer token
2. **PermissionAspect** → Check BOOKING_CREATE permission
3. **PermissionService.hasPermission()** → Check CUSTOMER role
4. **BookingController.create()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có BOOKING_CREATE
- **EMPLOYEE**: ❌ Không có BOOKING_CREATE
- **CUSTOMER**: ✅ Có BOOKING_CREATE

#### 3.2.2 Nhân Viên Xác Nhận Đặt Xe
```
POST /api/bookings/1/confirm
Authorization: Bearer <employee_token>
```

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate employee token
2. **PermissionAspect** → Check BOOKING_CONFIRM permission
3. **PermissionService.hasPermission()** → Check EMPLOYEE role
4. **BookingController.confirm()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có BOOKING_CONFIRM
- **EMPLOYEE**: ✅ Có BOOKING_CONFIRM
- **CUSTOMER**: ❌ Không có BOOKING_CONFIRM

#### 3.2.3 Khách Hàng Xem Đặt Xe Của Mình
```
GET /api/bookings/me
Authorization: Bearer <customer_token>
```

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate customer token
2. **PermissionAspect** → Check BOOKING_VIEW_MY permission
3. **PermissionService.hasPermission()** → Check CUSTOMER role
4. **BookingController.myBookings()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có BOOKING_VIEW_MY
- **EMPLOYEE**: ❌ Không có BOOKING_VIEW_MY
- **CUSTOMER**: ✅ Có BOOKING_VIEW_MY

### 3.3 Luồng Quản Lý Người Dùng (User Management)

#### 3.3.1 Admin Xem Tất Cả Người Dùng
```
GET /api/users
Authorization: Bearer <admin_token>
```

**Luồng phân quyền:**
1. **JwtAuthenticationFilter** → Validate admin token
2. **PermissionAspect** → Check USER_VIEW_ALL permission
3. **PermissionService.hasPermission()** → Check ADMIN role
4. **UserController.getAllUsers()** → Execute if authorized

**Permissions cần thiết:**
- **ADMIN**: ✅ Có USER_VIEW_ALL
- **EMPLOYEE**: ❌ Không có USER_VIEW_ALL
- **CUSTOMER**: ❌ Không có USER_VIEW_ALL

## 🔄 4. Luồng Xử Lý Lỗi Phân Quyền

### 4.1 Không Có Token
```
GET /api/vehicles
(No Authorization header)
```

**Luồng xử lý:**
1. **JwtAuthenticationFilter** → Không tìm thấy token
2. **SecurityConfig** → Redirect to login
3. **Trả về 401 Unauthorized**

### 4.2 Token Không Hợp Lệ
```
GET /api/vehicles
Authorization: Bearer invalid_token
```

**Luồng xử lý:**
1. **JwtAuthenticationFilter** → Validate token
2. **JwtUtil.validateToken()** → Token không hợp lệ
3. **Trả về 401 Unauthorized**

### 4.3 Không Có Quyền
```
POST /api/vehicles
Authorization: Bearer <customer_token>
```

**Luồng xử lý:**
1. **JwtAuthenticationFilter** → Validate token thành công
2. **PermissionAspect** → Check VEHICLE_CREATE permission
3. **PermissionService.hasPermission()** → CUSTOMER không có VEHICLE_CREATE
4. **Trả về 403 Forbidden** với thông báo lỗi

## 🎯 5. Luồng Khởi Tạo Phân Quyền

### 5.1 Khởi Tạo Permissions Mặc Định
```
POST /api/permissions/initialize
Authorization: Bearer <admin_token>
```

**Luồng xử lý:**
1. **PermissionController.initializePermissions()** → Chỉ admin
2. **PermissionService.initializeDefaultPermissions()** → Gán permissions
3. **RolePermissionRepository.save()** → Lưu vào database
4. **Trả về kết quả thành công**

### 5.2 Gán Permission Cho Role
```
POST /api/permissions/assign
Authorization: Bearer <admin_token>
Content-Type: application/json
{
  "role": "EMPLOYEE",
  "permissions": ["VEHICLE_CREATE", "VEHICLE_UPDATE"]
}
```

**Luồng xử lý:**
1. **PermissionController.assignPermissions()** → Validate admin
2. **PermissionService.assignPermissionsToRole()** → Xóa permissions cũ
3. **RolePermissionRepository.save()** → Lưu permissions mới
4. **Trả về kết quả thành công**

## 📊 6. Bảng Phân Quyền Chi Tiết

| Endpoint | Method | Permission Required | ADMIN | EMPLOYEE | CUSTOMER |
|----------|--------|-------------------|-------|----------|----------|
| `/api/vehicles` | GET | VEHICLE_VIEW | ✅ | ✅ | ✅ |
| `/api/vehicles` | POST | VEHICLE_CREATE | ✅ | ❌ | ❌ |
| `/api/vehicles/{id}` | PUT | VEHICLE_UPDATE | ✅ | ❌ | ❌ |
| `/api/vehicles/{id}` | DELETE | VEHICLE_DELETE | ✅ | ❌ | ❌ |
| `/api/vehicles/search` | GET | VEHICLE_SEARCH | ✅ | ✅ | ✅ |
| `/api/bookings` | POST | BOOKING_CREATE | ✅ | ❌ | ✅ |
| `/api/bookings/me` | GET | BOOKING_VIEW_MY | ✅ | ❌ | ✅ |
| `/api/bookings/{id}/confirm` | POST | BOOKING_CONFIRM | ✅ | ✅ | ❌ |
| `/api/bookings/{id}/activate` | POST | BOOKING_ACTIVATE | ✅ | ✅ | ❌ |
| `/api/bookings/{id}/complete` | POST | BOOKING_COMPLETE | ✅ | ✅ | ❌ |
| `/api/bookings/{id}/cancel` | POST | BOOKING_CANCEL | ✅ | ✅ | ✅ |
| `/api/permissions/**` | ALL | ADMIN role | ✅ | ❌ | ❌ |

## 🔧 7. Luồng Debug và Troubleshooting

### 7.1 Kiểm Tra Permissions Của User
```
GET /api/permissions/my-permissions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "permissions": [
    "VEHICLE_VIEW",
    "VEHICLE_SEARCH",
    "BOOKING_CREATE",
    "BOOKING_VIEW_MY",
    "BOOKING_CANCEL"
  ],
  "count": 5
}
```

### 7.2 Kiểm Tra Permissions Của Role
```
GET /api/permissions/role/CUSTOMER
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "role": "CUSTOMER",
  "permissions": [
    "CUSTOMER_PROFILE",
    "CUSTOMER_BOOKING",
    "CUSTOMER_VIEW_HISTORY",
    "VEHICLE_VIEW",
    "VEHICLE_SEARCH",
    "BOOKING_VIEW_MY",
    "BOOKING_CREATE",
    "BOOKING_CANCEL"
  ],
  "count": 8
}
```

## 🚀 8. Luồng Mở Rộng Hệ Thống

### 8.1 Thêm Permission Mới
1. **Thêm vào enum Permission**
2. **Cập nhật database schema**
3. **Gán permission cho roles phù hợp**
4. **Cập nhật controllers với @RequirePermission**

### 8.2 Thêm Role Mới
1. **Thêm vào enum User.Role**
2. **Tạo permissions mặc định cho role mới**
3. **Cập nhật SecurityConfig**
4. **Test phân quyền cho role mới**

## 📝 9. Best Practices

### 9.1 Thiết Kế Permission
- **Nguyên tắc tối thiểu**: Chỉ cấp quyền cần thiết
- **Phân nhóm rõ ràng**: Theo module chức năng
- **Mô tả chi tiết**: Dễ hiểu và quản lý

### 9.2 Bảo Mật
- **JWT token expiration**: Đặt thời gian hết hạn hợp lý
- **Permission validation**: Kiểm tra ở cả frontend và backend
- **Audit logging**: Ghi log các hoạt động quan trọng

### 9.3 Performance
- **Cache permissions**: Cache permissions của user
- **Database indexing**: Index trên role và permission
- **Lazy loading**: Chỉ load permissions khi cần

## 🎯 10. Kết Luận

Hệ thống phân quyền Car Rental được thiết kế với:
- **3 roles chính**: ADMIN, EMPLOYEE, CUSTOMER
- **30+ permissions**: Phân chia theo 6 module
- **Flexible architecture**: Dễ mở rộng và bảo trì
- **Security first**: Bảo mật cao với JWT + Permission-based
- **User-friendly**: API rõ ràng, dễ sử dụng

Luồng phân quyền đảm bảo mỗi user chỉ có thể thực hiện các hành động phù hợp với vai trò của mình, tạo nên một hệ thống an toàn và hiệu quả.
