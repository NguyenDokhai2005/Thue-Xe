package com.example.demo.Controller;

import com.example.demo.DTO.VehicleRequest;
import com.example.demo.DTO.VehicleResponse;
import com.example.demo.Entity.Vehicle;
import com.example.demo.Service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public List<VehicleResponse> listVehicles() {
        return vehicleService.listVehicles().stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<VehicleResponse> searchVehicles(
            @RequestParam(required = false) Vehicle.VehicleType type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return vehicleService.searchVehicles(type, minPrice, maxPrice).stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/by-price")
    public List<VehicleResponse> searchByPrice(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return vehicleService.searchByPrice(minPrice, maxPrice).stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/by-type")
    public List<VehicleResponse> searchByType(
            @RequestParam Vehicle.VehicleType type
    ) {
        return vehicleService.searchByType(type).stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/search/by-date")
    public List<VehicleResponse> searchByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startAt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endAt
    ) {
        return vehicleService.searchByDateAvailability(startAt, endAt).stream()
                .map(VehicleResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public VehicleResponse getVehicle(@PathVariable Long id) {
        return VehicleResponse.fromEntity(vehicleService.getVehicle(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        Vehicle created = vehicleService.createVehicle(request);
        return ResponseEntity.ok(VehicleResponse.fromEntity(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        Vehicle updated = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(VehicleResponse.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}



