package com.example.demo.Security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Annotation để kiểm tra permission cụ thể
 * Sử dụng: @RequirePermission(Permission.VEHICLE_CREATE)
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    com.example.demo.Entity.Permission value();
}
