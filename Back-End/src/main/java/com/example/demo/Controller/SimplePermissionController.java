package com.example.demo.Controller;

import com.example.demo.Entity.Permission;
import com.example.demo.Entity.User;
import com.example.demo.Service.SimplePermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller phân quyền đơn giản cho demo
 */
@RestController
@RequestMapping("/api/simple-permissions")
@CrossOrigin(origins = "*")
public class SimplePermissionController {
    
    @Autowired
    private SimplePermissionService permissionService;
    
    /**
     * Lấy permissions của user hiện tại
     * GET /api/simple-permissions/my-permissions
     */
    @GetMapping("/my-permissions")
    public ResponseEntity<Map<String, Object>> getMyPermissions() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Permission> permissions = permissionService.getCurrentUserPermissions();
            response.put("success", true);
            response.put("permissions", permissions);
            response.put("count", permissions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy permissions của một role
     * GET /api/simple-permissions/role/{role}
     */
    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getRolePermissions(@PathVariable String role) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            User.Role userRole = User.Role.valueOf(role.toUpperCase());
            List<Permission> permissions = permissionService.getRolePermissions(userRole);
            
            response.put("success", true);
            response.put("role", role);
            response.put("permissions", permissions);
            response.put("count", permissions.size());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("error", "Role không hợp lệ: " + role);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Kiểm tra permission cụ thể
     * GET /api/simple-permissions/check?permission=VIEW
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Object>> checkPermission(@RequestParam String permission) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Permission perm = Permission.valueOf(permission.toUpperCase());
            boolean hasPermission = permissionService.hasPermission(perm);
            
            response.put("success", true);
            response.put("permission", permission);
            response.put("hasPermission", hasPermission);
            response.put("description", perm.getDescription());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("error", "Permission không hợp lệ: " + permission);
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Lấy tất cả permissions có sẵn
     * GET /api/simple-permissions/all
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllPermissions() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Permission> allPermissions = List.of(Permission.values());
            
            response.put("success", true);
            response.put("permissions", allPermissions);
            response.put("count", allPermissions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Test endpoint - chỉ admin mới truy cập được
     * GET /api/simple-permissions/admin-only
     */
    @GetMapping("/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminOnly() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Chỉ admin mới thấy được message này!");
        response.put("permissions", permissionService.getCurrentUserPermissions());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Test endpoint - employee và admin
     * GET /api/simple-permissions/employee-or-admin
     */
    @GetMapping("/employee-or-admin")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<Map<String, Object>> employeeOrAdmin() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Employee hoặc Admin mới thấy được message này!");
        response.put("permissions", permissionService.getCurrentUserPermissions());
        
        return ResponseEntity.ok(response);
    }
}
