package com.example.demo.DTO;

import com.example.demo.Entity.VehiclePhoto;

public class VehiclePhotoResponse {
    
    private Long id;
    private String url;
    private Boolean isPrimary;
    
    public static VehiclePhotoResponse fromEntity(VehiclePhoto photo, String baseUrl) {
        VehiclePhotoResponse resp = new VehiclePhotoResponse();
        resp.id = photo.getId();
        // Convert relative URL to full URL
        String photoUrl = photo.getUrl();
        if (photoUrl != null && !photoUrl.startsWith("http")) {
            // If it's a relative path, prepend base URL
            if (photoUrl.startsWith("/")) {
                resp.url = baseUrl + photoUrl;
            } else {
                resp.url = baseUrl + "/" + photoUrl;
            }
        } else {
            resp.url = photoUrl;
        }
        resp.isPrimary = photo.getIsPrimary();
        return resp;
    }
    
    // Overload for backward compatibility
    public static VehiclePhotoResponse fromEntity(VehiclePhoto photo) {
        return fromEntity(photo, "http://localhost:8080");
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
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
}

