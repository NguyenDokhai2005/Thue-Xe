package com.example.demo.Entity;

/**
 * Enum định nghĩa các quyền đơn giản trong hệ thống Car Rental (Demo)
 */
public enum Permission {
    
    // ========== QUYỀN CƠ BẢN ==========
    VIEW("Xem dữ liệu"),
    CREATE("Tạo mới"),
    UPDATE("Cập nhật"),
    DELETE("Xóa"),
    MANAGE("Quản lý");
    
    private final String description;
    
    Permission(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
