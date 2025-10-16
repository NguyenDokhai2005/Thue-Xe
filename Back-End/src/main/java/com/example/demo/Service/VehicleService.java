package com.example.demo.Service;

import com.example.demo.DTO.VehicleRequest;
import com.example.demo.Entity.Vehicle;
import com.example.demo.Repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

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

    private void mapRequestToEntity(VehicleRequest req, Vehicle vehicle) {
        vehicle.setTitle(req.getTitle());
        vehicle.setVehicleType(req.getVehicleType());
        vehicle.setLicensePlate(req.getLicensePlate());
        vehicle.setDailyPrice(req.getDailyPrice());
        vehicle.setCurrency(req.getCurrency());
        vehicle.setDescription(req.getDescription());
    }
}



