package com.example.demo.Repository;

import com.example.demo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Tìm user theo username
     */
    Optional<User> findByUsername(String username);
    
    /**
     * Kiểm tra username đã tồn tại chưa
     */
    boolean existsByUsername(String username);
    
    /**
     * Tìm user theo role
     */
    java.util.List<User> findByRole(User.Role role);
    
    /**
     * Tìm user theo phone
     */
    Optional<User> findByPhone(String phone);
}