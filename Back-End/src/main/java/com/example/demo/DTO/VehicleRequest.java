package com.example.demo.DTO;

import com.example.demo.Entity.Vehicle;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class VehicleRequest {

    // owner fields removed (no owner in DB)

    @NotBlank
    @Size(max = 150)
    private String title;

    @NotNull
    private Vehicle.VehicleType vehicleType;

    @NotBlank
    @Size(max = 32)
    private String licensePlate;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal dailyPrice;

    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    private String description;

    // owner getters/setters removed

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Vehicle.VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(Vehicle.VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public BigDecimal getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(BigDecimal dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}



