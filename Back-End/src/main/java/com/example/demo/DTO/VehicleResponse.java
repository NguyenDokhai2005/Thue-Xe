package com.example.demo.DTO;

import com.example.demo.Entity.Vehicle;
import com.example.demo.Entity.VehiclePhoto;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class VehicleResponse {

    private Long id;
    private String title;
    private Vehicle.VehicleType vehicleType;
    private String licensePlate;
    private BigDecimal dailyPrice;
    private String currency;
    private Vehicle.VehicleStatus status;
    private String description;
    private List<VehiclePhotoResponse> photos;
    private String primaryPhotoUrl; // URL của ảnh chính để dễ dàng truy cập

    private static String buildFullUrl(String url, String baseUrl) {
        if (url == null) return null;
        if (url.startsWith("http")) return url; // Already full URL
        if (url.startsWith("/")) {
            return baseUrl + url;
        }
        return baseUrl + "/" + url;
    }

    public static VehicleResponse fromEntity(Vehicle vehicle, String baseUrl) {
        VehicleResponse resp = new VehicleResponse();
        resp.id = vehicle.getId();
        resp.title = vehicle.getTitle();
        resp.vehicleType = vehicle.getVehicleType();
        resp.licensePlate = vehicle.getLicensePlate();
        resp.dailyPrice = vehicle.getDailyPrice();
        resp.currency = vehicle.getCurrency();
        resp.status = vehicle.getStatus();
        resp.description = vehicle.getDescription();
        
        // Map photos nếu có
        if (vehicle.getPhotos() != null && !vehicle.getPhotos().isEmpty()) {
            resp.photos = vehicle.getPhotos().stream()
                    .map(photo -> VehiclePhotoResponse.fromEntity(photo, baseUrl))
                    .collect(Collectors.toList());
            
            // Tìm primary photo URL và convert to full URL
            String primaryUrl = vehicle.getPhotos().stream()
                    .filter(VehiclePhoto::getIsPrimary)
                    .findFirst()
                    .map(VehiclePhoto::getUrl)
                    .orElse(vehicle.getPhotos().get(0).getUrl()); // Nếu không có primary, lấy ảnh đầu tiên
            
            resp.primaryPhotoUrl = buildFullUrl(primaryUrl, baseUrl);
        }
        
        return resp;
    }
    
    // Overload for backward compatibility
    public static VehicleResponse fromEntity(Vehicle vehicle) {
        return fromEntity(vehicle, "http://localhost:8080");
    }

    public Long getId() {
        return id;
    }

    // owner fields removed

    public String getTitle() {
        return title;
    }

    public Vehicle.VehicleType getVehicleType() {
        return vehicleType;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public BigDecimal getDailyPrice() {
        return dailyPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public Vehicle.VehicleStatus getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public List<VehiclePhotoResponse> getPhotos() {
        return photos;
    }

    public void setPhotos(List<VehiclePhotoResponse> photos) {
        this.photos = photos;
    }

    public String getPrimaryPhotoUrl() {
        return primaryPhotoUrl;
    }

    public void setPrimaryPhotoUrl(String primaryPhotoUrl) {
        this.primaryPhotoUrl = primaryPhotoUrl;
    }
}



