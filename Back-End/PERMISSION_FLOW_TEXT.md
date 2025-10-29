# Luồng Phân Quyền - Text Diagram

## 🔐 1. LUỒNG XÁC THỰC (AUTHENTICATION)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Login    │───▶│  AuthController  │───▶│   UserService   │
│   Request       │    │   .login()       │    │   .login()      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   JwtUtil        │    │  Password       │
                       │ .generateToken() │    │  Validation     │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  JWT Token      │
                       │  Response       │
                       └──────────────────┘
```

## 🛡️ 2. LUỒNG PHÂN QUYỀN (AUTHORIZATION)

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│ JwtAuthFilter    │───▶│ SecurityContext │
│   + JWT Token   │    │ .doFilter()      │    │ .setUser()      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  @RequirePermission │
                       │  Annotation      │
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ PermissionAspect │───▶│ PermissionService│
                       │ .checkPermission()│   │ .hasPermission()│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  RolePermission  │    │   Database      │
                       │  Repository      │    │   Query         │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Allow/Deny      │
                       │  Response        │
                       └──────────────────┘
```

## 📋 3. LUỒNG CỤ THỂ THEO CHỨC NĂNG

### 3.1 KHÁCH HÀNG ĐẶT XE
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Customer      │───▶│  POST /bookings  │───▶│ BookingController│
│   Đặt Xe        │    │  + JWT Token     │    │ .create()       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ @RequirePermission│   │ PermissionService│
                       │ BOOKING_CREATE    │   │ .hasPermission()│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Check CUSTOMER  │    │  Query Database │
                       │  Role            │    │  role_permissions│
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  ✅ ALLOWED      │
                       │  Create Booking  │
                       └──────────────────┘
```

### 3.2 NHÂN VIÊN XÁC NHẬN ĐẶT XE
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Employee      │───▶│ POST /bookings/  │───▶│ BookingController│
│   Xác Nhận      │    │ {id}/confirm     │    │ .confirm()      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ @RequirePermission│    │ PermissionService│
                       │ BOOKING_CONFIRM  │    │ .hasPermission()│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Check EMPLOYEE  │    │  Query Database │
                       │  Role            │    │  role_permissions│
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  ✅ ALLOWED      │
                       │  Confirm Booking │
                       └──────────────────┘
```

### 3.3 KHÁCH HÀNG CỐ TẠO XE (BỊ TỪ CHỐI)
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Customer      │───▶│  POST /vehicles  │───▶│ VehicleController│
│   Tạo Xe        │    │  + JWT Token     │    │ .create()       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ @RequirePermission│    │ PermissionService│
                       │ VEHICLE_CREATE   │    │ .hasPermission()│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Check CUSTOMER  │    │  Query Database │
                       │  Role            │    │  role_permissions│
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  ❌ DENIED       │
                       │  403 Forbidden   │
                       │  "Không có quyền"│
                       └──────────────────┘
```

## 🔄 4. LUỒNG XỬ LÝ LỖI

### 4.1 KHÔNG CÓ TOKEN
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│ JwtAuthFilter    │───▶│ SecurityConfig  │
│   (No Token)    │    │ .doFilter()      │    │ .authorize()     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  401 Unauthorized│
                       │  "Token required"│
                       └──────────────────┘
```

### 4.2 TOKEN KHÔNG HỢP LỆ
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│ JwtAuthFilter    │───▶│ JwtUtil         │
│   + Invalid     │    │ .doFilter()      │    │ .validateToken()│
│   Token         │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  401 Unauthorized│
                       │  "Invalid token" │
                       └──────────────────┘
```

### 4.3 KHÔNG CÓ QUYỀN
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Request  │───▶│ PermissionAspect │───▶│ PermissionService│
│   + Valid Token │    │ .checkPermission()│   │ .hasPermission()│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Check User      │    │  Query Database │
                       │  Role &          │    │  role_permissions│
                       │  Permission      │    │                 │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  403 Forbidden   │
                       │  "Access denied" │
                       │  + Permission    │
                       │    required      │
                       └──────────────────┘
```

## 🎯 5. LUỒNG KHỞI TẠO PHÂN QUYỀN

### 5.1 KHỞI TẠO PERMISSIONS MẶC ĐỊNH
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Admin         │───▶│ POST /permissions│───▶│ PermissionController│
│   Initialize    │    │ /initialize      │    │ .initialize()   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Check ADMIN     │    │ PermissionService│
                       │  Role            │    │ .initializeDefault│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  RolePermission  │    │   Database      │
                       │  Repository      │    │   Insert        │
                       │  .save()         │    │   Permissions   │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  ✅ SUCCESS      │
                       │  "Permissions    │
                       │   initialized"   │
                       └──────────────────┘
```

### 5.2 GÁN PERMISSION CHO ROLE
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Admin         │───▶│ POST /permissions│───▶│ PermissionController│
│   Assign        │    │ /assign          │    │ .assignPermissions()│
│   Permissions   │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Validate        │    │ PermissionService│
                       │  Request Data    │    │ .assignPermissions│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Delete Old      │    │  Insert New     │
                       │  Permissions     │    │  Permissions    │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  ✅ SUCCESS      │
                       │  "Permissions    │
                       │   assigned"      │
                       └──────────────────┘
```

## 📊 6. BẢNG PHÂN QUYỀN CHI TIẾT

```
┌─────────────────┬─────────────┬─────────────────┬─────────┬───────────┬──────────┐
│   Endpoint      │   Method    │   Permission    │  ADMIN  │ EMPLOYEE  │ CUSTOMER │
├─────────────────┼─────────────┼─────────────────┼─────────┼───────────┼──────────┤
│ /api/vehicles   │    GET      │ VEHICLE_VIEW    │   ✅    │    ✅     │    ✅    │
│ /api/vehicles   │   POST      │ VEHICLE_CREATE  │   ✅    │    ❌     │    ❌    │
│ /api/vehicles   │    PUT      │ VEHICLE_UPDATE  │   ✅    │    ❌     │    ❌    │
│ /api/vehicles   │  DELETE     │ VEHICLE_DELETE  │   ✅    │    ❌     │    ❌    │
│ /api/vehicles   │   SEARCH    │ VEHICLE_SEARCH  │   ✅    │    ✅     │    ✅    │
├─────────────────┼─────────────┼─────────────────┼─────────┼───────────┼──────────┤
│ /api/bookings   │   POST      │ BOOKING_CREATE  │   ✅    │    ❌     │    ✅    │
│ /api/bookings/me│    GET      │ BOOKING_VIEW_MY │   ✅    │    ❌     │    ✅    │
│ /api/bookings   │  CONFIRM    │ BOOKING_CONFIRM │   ✅    │    ✅     │    ❌    │
│ /api/bookings   │  ACTIVATE   │ BOOKING_ACTIVATE│   ✅    │    ✅     │    ❌    │
│ /api/bookings   │  COMPLETE   │ BOOKING_COMPLETE│   ✅    │    ✅     │    ❌    │
│ /api/bookings   │   CANCEL    │ BOOKING_CANCEL  │   ✅    │    ✅     │    ✅    │
├─────────────────┼─────────────┼─────────────────┼─────────┼───────────┼──────────┤
│ /api/permissions│    ALL      │ ADMIN role      │   ✅    │    ❌     │    ❌    │
└─────────────────┴─────────────┴─────────────────┴─────────┴───────────┴──────────┘
```

## 🔧 7. LUỒNG DEBUG VÀ TROUBLESHOOTING

### 7.1 KIỂM TRA PERMISSIONS CỦA USER
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User          │───▶│ GET /permissions│───▶│ PermissionController│
│   Check Perms   │    │ /my-permissions  │    │ .getMyPermissions()│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Extract User    │    │ PermissionService│
                       │  from Token      │    │ .getCurrentUser│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Query User     │    │  Return User    │
                       │  Permissions    │    │  Permissions    │
                       └──────────────────┘    └─────────────────┘
```

### 7.2 KIỂM TRA PERMISSIONS CỦA ROLE
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Admin         │───▶│ GET /permissions│───▶│ PermissionController│
│   Check Role    │    │ /role/{role}    │    │ .getRolePermissions()│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Validate       │    │ PermissionService│
                       │  Admin Role     │    │ .getRolePermissions()│
                       └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Query Role     │    │  Return Role    │
                       │  Permissions    │    │  Permissions    │
                       └──────────────────┘    └─────────────────┘
```

## 🚀 8. LUỒNG MỞ RỘNG HỆ THỐNG

### 8.1 THÊM PERMISSION MỚI
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │───▶│  Add to Enum     │───▶│  Update Database│
│   Add Permission│    │  Permission      │    │  Schema         │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Assign to       │    │  Update         │
                       │  Roles           │    │  Controllers    │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  Test New        │
                       │  Permission      │
                       └──────────────────┘
```

### 8.2 THÊM ROLE MỚI
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Developer     │───▶│  Add to Enum     │───▶│  Create Default │
│   Add Role      │    │  User.Role       │    │  Permissions    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                         │
                                ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Update          │    │  Test New       │
                       │  SecurityConfig  │    │  Role           │
                       └──────────────────┘    └─────────────────┘
```

## 📝 9. BEST PRACTICES

### 9.1 THIẾT KẾ PERMISSION
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Principle     │───▶│  Least Privilege │───▶│  Only Required  │
│   of Least      │    │  Access          │    │  Permissions    │
│   Privilege     │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 9.2 BẢO MẬT
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   JWT Token     │───▶│  Permission     │───▶│  Audit Logging  │
│   Expiration    │    │  Validation      │    │  & Monitoring   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 9.3 PERFORMANCE
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cache         │───▶│  Database       │───▶│  Lazy Loading   │
│   Permissions   │    │  Indexing        │    │  When Needed    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🎯 10. KẾT LUẬN

Hệ thống phân quyền Car Rental được thiết kế với:
- **3 roles chính**: ADMIN, EMPLOYEE, CUSTOMER
- **30+ permissions**: Phân chia theo 6 module
- **Flexible architecture**: Dễ mở rộng và bảo trì
- **Security first**: Bảo mật cao với JWT + Permission-based
- **User-friendly**: API rõ ràng, dễ sử dụng

Luồng phân quyền đảm bảo mỗi user chỉ có thể thực hiện các hành động phù hợp với vai trò của mình, tạo nên một hệ thống an toàn và hiệu quả.
