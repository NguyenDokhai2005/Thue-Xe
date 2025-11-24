package com.example.demo.Service;

import com.example.demo.DTO.VehicleRequest;
import com.example.demo.Entity.Vehicle;
import com.example.demo.Repository.VehicleRepository;
import com.example.demo.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@Transactional
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Vehicle createVehicle(VehicleRequest req) {
        Vehicle vehicle = new Vehicle();
        mapRequestToEntity(req, vehicle);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, VehicleRequest req) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại!"));
        mapRequestToEntity(req, vehicle);
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại!"));
        vehicleRepository.delete(vehicle);
    }

    public Vehicle getVehicle(Long id) {
        return vehicleRepository.findByIdWithPhotos(id)
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại!"));
    }

    public List<Vehicle> listVehicles() {
        return vehicleRepository.findAllWithPhotos();
    }

    public List<Vehicle> searchVehicles(Vehicle.VehicleType type, BigDecimal minPrice, BigDecimal maxPrice) {
        // Load tất cả vehicles với photos trước
        List<Vehicle> allVehicles = vehicleRepository.findAllWithPhotosForSearch();
        
        // Filter theo criteria
        return allVehicles.stream()
                .filter(v -> type == null || v.getVehicleType() == type)
                .filter(v -> minPrice == null || v.getDailyPrice().compareTo(minPrice) >= 0)
                .filter(v -> maxPrice == null || v.getDailyPrice().compareTo(maxPrice) <= 0)
                .toList();
    }

    public List<Vehicle> searchByPrice(BigDecimal minPrice, BigDecimal maxPrice) {
        return searchVehicles(null, minPrice, maxPrice);
    }

    public List<Vehicle> searchByType(Vehicle.VehicleType type) {
        return searchVehicles(type, null, null);
    }

    public List<Vehicle> searchByDateAvailability(LocalDateTime startAt, LocalDateTime endAt) {
        List<Vehicle> all = vehicleRepository.findAllWithPhotos();
        return all.stream()
                .filter(v -> bookingRepository.findOverlaps(v, startAt, endAt).isEmpty())
                .toList();
    }

    private void mapRequestToEntity(VehicleRequest req, Vehicle vehicle) {
        vehicle.setTitle(req.getTitle());
        vehicle.setVehicleType(req.getVehicleType());
        vehicle.setLicensePlate(req.getLicensePlate());
        vehicle.setDailyPrice(req.getDailyPrice());
        vehicle.setCurrency(req.getCurrency());
        vehicle.setDescription(req.getDescription());
    }
}



