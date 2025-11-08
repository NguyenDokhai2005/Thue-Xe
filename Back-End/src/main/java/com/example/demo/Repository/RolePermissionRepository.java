package com.example.demo.Repository;

import com.example.demo.Entity.Permission;
import com.example.demo.Entity.RolePermission;
import com.example.demo.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    
    /**
     * Tìm tất cả permissions của một role
     */
    @Query("SELECT rp.permission FROM RolePermission rp WHERE rp.role = :role AND rp.isActive = true")
    List<Permission> findPermissionsByRole(@Param("role") User.Role role);
    
    /**
     * Kiểm tra role có permission cụ thể không
     */
    @Query("SELECT COUNT(rp) > 0 FROM RolePermission rp WHERE rp.role = :role AND rp.permission = :permission AND rp.isActive = true")
    boolean hasPermission(@Param("role") User.Role role, @Param("permission") Permission permission);
    
    /**
     * Tìm RolePermission theo role và permission
     */
    Optional<RolePermission> findByRoleAndPermission(User.Role role, Permission permission);
    
    /**
     * Tìm tất cả RolePermission của một role
     */
    List<RolePermission> findByRoleAndIsActiveTrue(User.Role role);
    
    /**
     * Tìm tất cả RolePermission của một permission
     */
    List<RolePermission> findByPermissionAndIsActiveTrue(Permission permission);
    
    /**
     * Xóa tất cả permissions của một role
     */
    void deleteByRole(User.Role role);
    
    /**
     * Kiểm tra role có tồn tại permissions không
     */
    boolean existsByRoleAndIsActiveTrue(User.Role role);
}
