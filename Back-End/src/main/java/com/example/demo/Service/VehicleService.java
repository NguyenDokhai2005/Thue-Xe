package com.example.demo.Service;

import com.example.demo.DTO.VehicleRequest;
import com.example.demo.Entity.Vehicle;
import com.example.demo.Repository.VehicleRepository;
import com.example.demo.Repository.BookingRepository;
import org.springframework.data.jpa.domain.Specification;
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
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại!"));
    }

    public List<Vehicle> listVehicles() {
        return vehicleRepository.findAll();
    }

    public List<Vehicle> searchVehicles(Vehicle.VehicleType type, BigDecimal minPrice, BigDecimal maxPrice) {
        Specification<Vehicle> spec = Specification.where(null);

        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("vehicleType"), type));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dailyPrice"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("dailyPrice"), maxPrice));
        }

        return vehicleRepository.findAll(spec);
    }

    public List<Vehicle> searchByPrice(BigDecimal minPrice, BigDecimal maxPrice) {
        return searchVehicles(null, minPrice, maxPrice);
    }

    public List<Vehicle> searchByType(Vehicle.VehicleType type) {
        return searchVehicles(type, null, null);
    }

    public List<Vehicle> searchByDateAvailability(LocalDateTime startAt, LocalDateTime endAt) {
        List<Vehicle> all = vehicleRepository.findAll();
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



