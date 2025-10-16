package com.example.demo.DTO;

import com.example.demo.Entity.Vehicle;

import java.math.BigDecimal;

public class VehicleResponse {

    private Long id;
    private String title;
    private Vehicle.VehicleType vehicleType;
    private String licensePlate;
    private BigDecimal dailyPrice;
    private String currency;
    private Vehicle.VehicleStatus status;
    private String description;

    public static VehicleResponse fromEntity(Vehicle vehicle) {
        VehicleResponse resp = new VehicleResponse();
        resp.id = vehicle.getId();
        resp.title = vehicle.getTitle();
        resp.vehicleType = vehicle.getVehicleType();
        resp.licensePlate = vehicle.getLicensePlate();
        resp.dailyPrice = vehicle.getDailyPrice();
        resp.currency = vehicle.getCurrency();
        resp.status = vehicle.getStatus();
        resp.description = vehicle.getDescription();
        return resp;
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
}



