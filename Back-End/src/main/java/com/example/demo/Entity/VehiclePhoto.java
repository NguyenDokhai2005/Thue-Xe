package com.example.demo.Entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "vehicle_photos")
public class VehiclePhoto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @Column(name = "url", nullable = false, length = 512)
    private String url;
    
    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;
    
    @Column(name = "created_at", insertable = false, updatable = false)
    private Timestamp createdAt;
    
    // Constructors
    public VehiclePhoto() {}
    
    public VehiclePhoto(Vehicle vehicle, String url, Boolean isPrimary) {
        this.vehicle = vehicle;
        this.url = url;
        this.isPrimary = isPrimary;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Vehicle getVehicle() {
        return vehicle;
    }
    
    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public Boolean getIsPrimary() {
        return isPrimary;
    }
    
    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
    
    public Timestamp getCreatedAt() {
        return createdAt;
    }
}

