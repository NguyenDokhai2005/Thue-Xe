package com.example.demo.Controller;

import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin-setup")
@CrossOrigin(origins = "*")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Tạo tài khoản admin (chỉ dùng trong development)
     * POST /api/admin-setup/create-admin
     */
    @PostMapping("/create-admin")
    public ResponseEntity<Map<String, Object>> createAdmin(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = request.getOrDefault("username", "admin");
            String password = request.getOrDefault("password", "admin123");
            String fullName = request.getOrDefault("fullName", "System Administrator");
            String phone = request.getOrDefault("phone", "0123456789");
            
            // Kiểm tra admin đã tồn tại chưa
            if (userRepository.existsByUsername(username)) {
                // Cập nhật user hiện có thành admin
                User existingUser = userRepository.findByUsername(username).orElse(null);
                if (existingUser != null) {
                    existingUser.setRole(User.Role.ADMIN);
                    existingUser.setPassword(passwordEncoder.encode(password));
                    existingUser.setFullName(fullName);
                    existingUser.setPhone(phone);
                    userRepository.save(existingUser);
                    
                    response.put("success", true);
                    response.put("message", "User updated to admin successfully!");
                    response.put("username", username);
                    response.put("action", "updated");
                }
            } else {
                // Tạo admin mới
                User admin = new User();
                admin.setUsername(username);
                admin.setPassword(passwordEncoder.encode(password));
                admin.setFullName(fullName);
                admin.setPhone(phone);
                admin.setRole(User.Role.ADMIN);
                
                userRepository.save(admin);
                
                response.put("success", true);
                response.put("message", "Admin created successfully!");
                response.put("username", username);
                response.put("action", "created");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Kiểm tra admin có tồn tại không
     * GET /api/admin-setup/check-admin
     */
    @GetMapping("/check-admin")
    public ResponseEntity<Map<String, Object>> checkAdmin() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);
            boolean adminExists = !admins.isEmpty();
            
            response.put("adminExists", adminExists);
            response.put("adminCount", admins.size());
            
            if (adminExists) {
                response.put("admins", admins.stream().map(admin -> {
                    Map<String, Object> adminInfo = new HashMap<>();
                    adminInfo.put("id", admin.getId());
                    adminInfo.put("username", admin.getUsername());
                    adminInfo.put("fullName", admin.getFullName());
                    adminInfo.put("phone", admin.getPhone());
                    return adminInfo;
                }).toList());
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Tạo admin với thông tin mặc định
     * POST /api/admin-setup/create-default-admin
     */
    @PostMapping("/create-default-admin")
    public ResponseEntity<Map<String, Object>> createDefaultAdmin() {
        Map<String, String> request = new HashMap<>();
        request.put("username", "admin");
        request.put("password", "admin123");
        request.put("fullName", "System Administrator");
        request.put("phone", "0123456789");
        
        return createAdmin(request);
    }
    
    /**
     * Liệt kê tất cả admin
     * GET /api/admin-setup/list-admins
     */
    @GetMapping("/list-admins")
    public ResponseEntity<Map<String, Object>> listAdmins() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<User> admins = userRepository.findByRole(User.Role.ADMIN);
            
            response.put("success", true);
            response.put("adminCount", admins.size());
            response.put("admins", admins.stream().map(admin -> {
                Map<String, Object> adminInfo = new HashMap<>();
                adminInfo.put("id", admin.getId());
                adminInfo.put("username", admin.getUsername());
                adminInfo.put("fullName", admin.getFullName());
                adminInfo.put("phone", admin.getPhone());
                adminInfo.put("role", admin.getRole());
                return adminInfo;
            }).toList());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
