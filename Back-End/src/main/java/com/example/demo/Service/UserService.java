package com.example.demo.Service;

import com.example.demo.DTO.AuthResponse;
import com.example.demo.DTO.LoginRequest;
import com.example.demo.DTO.RegisterRequest;
import com.example.demo.Entity.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    /**
     * Đăng ký user mới
     */
    public AuthResponse register(RegisterRequest registerRequest) {
        // Kiểm tra username đã tồn tại chưa
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username đã tồn tại!");
        }
        
        // Tạo user mới
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setPhone(registerRequest.getPhone());
        user.setRole(User.Role.CUSTOMER); // Mặc định là CUSTOMER
        
        // Lưu user vào database
        User savedUser = userRepository.save(user);
        
        // Tạo JWT token
        String token = jwtUtil.generateToken(savedUser);
        
        // Trả về AuthResponse
        return new AuthResponse(token, savedUser);
    }
    
    /**
     * Đăng nhập user
     */
    public AuthResponse login(LoginRequest loginRequest) {
        // Xác thực user
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsername(),
                loginRequest.getPassword()
            )
        );
        
        // Lấy user từ database
        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        
        // Tạo JWT token
        String token = jwtUtil.generateToken(user);
        
        // Trả về AuthResponse
        return new AuthResponse(token, user);
    }
    
    /**
     * Lấy thông tin user hiện tại
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User chưa đăng nhập!");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
    }
    
    /**
     * Cập nhật thông tin user
     */
    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getId())
            .orElseThrow(() -> new RuntimeException("User không tồn tại!"));
        
        // Cập nhật thông tin
        existingUser.setFullName(user.getFullName());
        existingUser.setPhone(user.getPhone());
        
        return userRepository.save(existingUser);
    }
    
    /**
     * Thay đổi password
     */
    public void changePassword(String oldPassword, String newPassword) {
        User currentUser = getCurrentUser();
        
        // Kiểm tra password cũ
        if (!passwordEncoder.matches(oldPassword, currentUser.getPassword())) {
            throw new RuntimeException("Password cũ không đúng!");
        }
        
        // Cập nhật password mới
        currentUser.setPassword(passwordEncoder.encode(newPassword));
        
        userRepository.save(currentUser);
    }
    
    /**
     * Tìm user theo ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * Tìm user theo username
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    /**
     * Load user by username cho Spring Security
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User không tồn tại: " + username));
        
        return user;
    }
}