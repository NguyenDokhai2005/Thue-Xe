package com.example.demo.DTO;

import com.example.demo.Entity.User;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String fullName;
    private String phone;
    private User.Role role;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, User user) {
        this.token = token;
        this.id = user.getId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.phone = user.getPhone();
        this.role = user.getRole();
    }
    
    public AuthResponse(String token, String type, Long id, String username, String fullName, String phone, User.Role role) {
        this.token = token;
        this.type = type;
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getPhone() {
        return phone;
    }
    
    public void setPhone(String phone) {
        this.phone = phone;
    }
    
    public User.Role getRole() {
        return role;
    }
    
    public void setRole(User.Role role) {
        this.role = role;
    }
}
