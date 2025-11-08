package com.example.demo.Security;

import com.example.demo.Entity.Permission;
import com.example.demo.Service.SimplePermissionService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
public class PermissionAspect {
    
    @Autowired
    private SimplePermissionService permissionService;
    
    @Around("@annotation(requirePermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, RequirePermission requirePermission) throws Throwable {
        Permission requiredPermission = requirePermission.value();
        
        if (!permissionService.hasPermission(requiredPermission)) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Access denied");
            response.put("message", "Bạn không có quyền thực hiện hành động này");
            response.put("requiredPermission", requiredPermission.name());
            response.put("description", requiredPermission.getDescription());
            
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        
        return joinPoint.proceed();
    }
}
