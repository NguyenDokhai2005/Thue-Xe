# Hướng Dẫn Phân Quyền Đơn Giản - Demo Car Rental

## 🎯 **Tổng Quan**

Hệ thống phân quyền đơn giản cho demo với:
- **3 Roles**: ADMIN, EMPLOYEE, CUSTOMER
- **5 Permissions**: VIEW, CREATE, UPDATE, DELETE, MANAGE
- **Logic đơn giản**: Dựa trên role, không cần database phức tạp

## 🔐 **Phân Quyền Theo Role**

### **ADMIN** 
- ✅ **Có tất cả quyền**: VIEW, CREATE, UPDATE, DELETE, MANAGE
- 🎯 **Có thể**: Làm mọi thứ trong hệ thống

### **EMPLOYEE**
- ✅ **VIEW**: Xem dữ liệu
- ✅ **CREATE**: Tạo mới
- ✅ **UPDATE**: Cập nhật
- ✅ **MANAGE**: Quản lý
- ❌ **DELETE**: Không được xóa

### **CUSTOMER**
- ✅ **VIEW**: Chỉ được xem
- ❌ **CREATE, UPDATE, DELETE, MANAGE**: Không được

## 📋 **Bảng Phân Quyền Endpoints**

| Endpoint | Method | ADMIN | EMPLOYEE | CUSTOMER |
|----------|--------|-------|----------|----------|
| `/api/vehicles` | GET | ✅ | ✅ | ✅ |
| `/api/vehicles` | POST | ✅ | ❌ | ❌ |
| `/api/vehicles/{id}` | PUT | ✅ | ❌ | ❌ |
| `/api/vehicles/{id}` | DELETE | ✅ | ❌ | ❌ |
| `/api/vehicles/search` | GET | ✅ | ✅ | ✅ |
| `/api/bookings` | POST | ✅ | ❌ | ✅ |
| `/api/bookings/me` | GET | ✅ | ❌ | ✅ |
| `/api/bookings/{id}/confirm` | POST | ✅ | ✅ | ❌ |
| `/api/bookings/{id}/activate` | POST | ✅ | ✅ | ❌ |
| `/api/bookings/{id}/complete` | POST | ✅ | ✅ | ❌ |
| `/api/bookings/{id}/cancel` | POST | ✅ | ✅ | ✅ |

## 🚀 **API Phân Quyền Đơn Giản**

### 1. **Lấy Permissions Của User Hiện Tại**
```http
GET /api/simple-permissions/my-permissions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "permissions": ["VIEW", "CREATE", "UPDATE", "DELETE", "MANAGE"],
  "count": 5
}
```

### 2. **Lấy Permissions Của Role**
```http
GET /api/simple-permissions/role/ADMIN
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "role": "ADMIN",
  "permissions": ["VIEW", "CREATE", "UPDATE", "DELETE", "MANAGE"],
  "count": 5
}
```

### 3. **Kiểm Tra Permission Cụ Thể**
```http
GET /api/simple-permissions/check?permission=CREATE
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "permission": "CREATE",
  "hasPermission": true,
  "description": "Tạo mới"
}
```

### 4. **Lấy Tất Cả Permissions**
```http
GET /api/simple-permissions/all
```

**Response:**
```json
{
  "success": true,
  "permissions": [
    {"name": "VIEW", "description": "Xem dữ liệu"},
    {"name": "CREATE", "description": "Tạo mới"},
    {"name": "UPDATE", "description": "Cập nhật"},
    {"name": "DELETE", "description": "Xóa"},
    {"name": "MANAGE", "description": "Quản lý"}
  ],
  "count": 5
}
```

### 5. **Test Endpoint - Chỉ Admin**
```http
GET /api/simple-permissions/admin-only
Authorization: Bearer <admin_token>
```

### 6. **Test Endpoint - Employee hoặc Admin**
```http
GET /api/simple-permissions/employee-or-admin
Authorization: Bearer <employee_token>
```

## 🧪 **Test Phân Quyền**

### **Test 1: Customer Xem Xe (✅ Thành công)**
```http
GET /api/vehicles
Authorization: Bearer <customer_token>
```

### **Test 2: Customer Tạo Xe (❌ Bị từ chối)**
```http
POST /api/vehicles
Authorization: Bearer <customer_token>
Content-Type: application/json
{
  "brand": "Toyota",
  "model": "Camry",
  "type": "SEDAN",
  "price": 500000
}
```
**Response: 403 Forbidden**

### **Test 3: Employee Xác Nhận Đặt Xe (✅ Thành công)**
```http
POST /api/bookings/1/confirm
Authorization: Bearer <employee_token>
```

### **Test 4: Customer Xác Nhận Đặt Xe (❌ Bị từ chối)**
```http
POST /api/bookings/1/confirm
Authorization: Bearer <customer_token>
```
**Response: 403 Forbidden**

## 🔧 **Cách Sử Dụng Trong Code**

### **1. Bảo Vệ Endpoint với @PreAuthorize**
```java
@PostMapping("/vehicles")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
    // Chỉ ADMIN mới được tạo xe
}
```

### **2. Kiểm Tra Permission trong Service**
```java
@Autowired
private SimplePermissionService permissionService;

public void someMethod() {
    if (permissionService.hasPermission(Permission.CREATE)) {
        // Thực hiện tạo mới
    } else {
        throw new AccessDeniedException("Không có quyền tạo mới");
    }
}
```

### **3. Lấy Permissions của User**
```java
List<Permission> userPermissions = permissionService.getCurrentUserPermissions();
```

## 📊 **Logic Phân Quyền Đơn Giản**

```java
// Trong SimplePermissionService
public boolean hasPermission(User.Role role, Permission permission) {
    return switch (role) {
        case ADMIN -> true; // Admin có tất cả quyền
        case EMPLOYEE -> hasEmployeePermission(permission);
        case CUSTOMER -> hasCustomerPermission(permission);
    };
}

private boolean hasEmployeePermission(Permission permission) {
    return switch (permission) {
        case VIEW, CREATE, UPDATE, MANAGE -> true;
        case DELETE -> false; // Employee không được xóa
    };
}

private boolean hasCustomerPermission(Permission permission) {
    return switch (permission) {
        case VIEW -> true; // Customer chỉ được xem
        case CREATE, UPDATE, DELETE, MANAGE -> false;
    };
}
```

## 🎯 **Ví Dụ Thực Tế**

### **Scenario 1: Khách Hàng Đặt Xe**
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
**✅ Thành công** - Customer có quyền CREATE booking

### **Scenario 2: Nhân Viên Xác Nhận Đặt Xe**
```http
POST /api/bookings/1/confirm
Authorization: Bearer <employee_token>
```
**✅ Thành công** - Employee có quyền MANAGE booking

### **Scenario 3: Khách Hàng Tạo Xe**
```http
POST /api/vehicles
Authorization: Bearer <customer_token>
Content-Type: application/json
{
  "brand": "Honda",
  "model": "Civic"
}
```
**❌ Bị từ chối** - Customer không có quyền CREATE vehicle

## 🚀 **Ưu Điểm Của Hệ Thống Đơn Giản**

✅ **Dễ hiểu**: Chỉ 3 roles và 5 permissions  
✅ **Không cần database**: Logic đơn giản trong code  
✅ **Dễ test**: Có thể test nhanh với Postman  
✅ **Phù hợp demo**: Đủ để demo tính năng phân quyền  
✅ **Dễ mở rộng**: Có thể thêm logic phức tạp sau  

## 🔄 **So Sánh Với Hệ Thống Phức Tạp**

| Tính Năng | Hệ Thống Phức Tạp | Hệ Thống Đơn Giản |
|-----------|-------------------|-------------------|
| Permissions | 30+ permissions | 5 permissions |
| Database | Cần bảng role_permissions | Không cần |
| Logic | Phức tạp với AOP | Đơn giản với switch-case |
| Setup | Cần khởi tạo database | Sẵn sàng ngay |
| Demo | Khó hiểu | Dễ hiểu |

## 🎯 **Kết Luận**

Hệ thống phân quyền đơn giản này phù hợp cho:
- **Demo và presentation**
- **Học tập và nghiên cứu**
- **Prototype nhanh**
- **Team mới bắt đầu**

Với chỉ **3 roles** và **5 permissions**, bạn có thể demo đầy đủ tính năng phân quyền mà không cần setup phức tạp!
