package com.example.demo.Service;

import com.example.demo.Entity.Permission;
import com.example.demo.Entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

/**
 * Service phân quyền đơn giản cho demo
 */
@Service
public class SimplePermissionService {
    
    /**
     * Kiểm tra user hiện tại có permission không
     */
    public boolean hasPermission(Permission permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        User user = (User) authentication.getPrincipal();
        return hasPermission(user.getRole(), permission);
    }
    
    /**
     * Kiểm tra role có permission không (logic đơn giản)
     */
    public boolean hasPermission(User.Role role, Permission permission) {
        return switch (role) {
            case ADMIN -> true; // Admin có tất cả quyền
            case EMPLOYEE -> hasEmployeePermission(permission);
            case CUSTOMER -> hasCustomerPermission(permission);
        };
    }
    
    /**
     * Permissions của Employee
     */
    private boolean hasEmployeePermission(Permission permission) {
        return switch (permission) {
            case VIEW, CREATE, UPDATE, MANAGE -> true; // Employee có quyền xem, tạo, sửa, quản lý
            case DELETE -> false; // Employee không được xóa
        };
    }
    
    /**
     * Permissions của Customer
     */
    private boolean hasCustomerPermission(Permission permission) {
        return switch (permission) {
            case VIEW -> true; // Customer chỉ được xem
            case CREATE, UPDATE, DELETE, MANAGE -> false; // Customer không được tạo, sửa, xóa, quản lý
        };
    }
    
    /**
     * Lấy permissions của user hiện tại
     */
    public List<Permission> getCurrentUserPermissions() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return List.of();
        }
        
        User user = (User) authentication.getPrincipal();
        return getRolePermissions(user.getRole());
    }
    
    /**
     * Lấy permissions của một role
     */
    public List<Permission> getRolePermissions(User.Role role) {
        return switch (role) {
            case ADMIN -> Arrays.asList(Permission.values()); // Admin có tất cả
            case EMPLOYEE -> Arrays.asList(Permission.VIEW, Permission.CREATE, Permission.UPDATE, Permission.MANAGE);
            case CUSTOMER -> Arrays.asList(Permission.VIEW);
        };
    }
    
    /**
     * Kiểm tra user có thể thực hiện action không
     */
    public boolean canPerformAction(String action) {
        try {
            Permission permission = Permission.valueOf(action.toUpperCase());
            return hasPermission(permission);
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
