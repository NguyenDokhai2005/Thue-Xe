package com.example.demo.Controller;

import com.example.demo.DTO.VehicleRequest;
import com.example.demo.DTO.VehicleResponse;
import com.example.demo.Entity.Vehicle;
import com.example.demo.Service.VehicleService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
    
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @GetMapping
    public List<VehicleResponse> listVehicles(HttpServletRequest request) {
        String serverBaseUrl = getBaseUrl(request);
        return vehicleService.listVehicles().stream()
                .map(vehicle -> VehicleResponse.fromEntity(vehicle, serverBaseUrl))
                .collect(Collectors.toList());
    }
    
    private String getBaseUrl(HttpServletRequest request) {
        // Try to use configured base URL, otherwise build from request
        if (baseUrl != null && !baseUrl.isEmpty() && !baseUrl.equals("http://localhost:8080")) {
            return baseUrl;
        }
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        return scheme + "://" + serverName + (serverPort != 80 && serverPort != 443 ? ":" + serverPort : "");
    }

    @GetMapping("/search")
    public List<VehicleResponse> searchVehicles(
            @RequestParam(required = false) Vehicle.VehicleType type,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            HttpServletRequest request
    ) {
        String serverBaseUrl = getBaseUrl(request);
        return vehicleService.searchVehicles(type, minPrice, maxPrice).stream()
                .map(vehicle -> VehicleResponse.fromEntity(vehicle, serverBaseUrl))
                .collect(Collectors.toList());
    }

    @GetMapping("/search/by-price")
    public List<VehicleResponse> searchByPrice(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            HttpServletRequest request
    ) {
        String serverBaseUrl = getBaseUrl(request);
        return vehicleService.searchByPrice(minPrice, maxPrice).stream()
                .map(vehicle -> VehicleResponse.fromEntity(vehicle, serverBaseUrl))
                .collect(Collectors.toList());
    }

    @GetMapping("/search/by-type")
    public List<VehicleResponse> searchByType(
            @RequestParam Vehicle.VehicleType type,
            HttpServletRequest request
    ) {
        String serverBaseUrl = getBaseUrl(request);
        return vehicleService.searchByType(type).stream()
                .map(vehicle -> VehicleResponse.fromEntity(vehicle, serverBaseUrl))
                .collect(Collectors.toList());
    }

    @GetMapping("/search/by-date")
    public List<VehicleResponse> searchByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startAt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endAt,
            HttpServletRequest request
    ) {
        String serverBaseUrl = getBaseUrl(request);
        return vehicleService.searchByDateAvailability(startAt, endAt).stream()
                .map(vehicle -> VehicleResponse.fromEntity(vehicle, serverBaseUrl))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public VehicleResponse getVehicle(@PathVariable Long id, HttpServletRequest request) {
        String serverBaseUrl = getBaseUrl(request);
        return VehicleResponse.fromEntity(vehicleService.getVehicle(id), serverBaseUrl);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request, HttpServletRequest httpRequest) {
        String serverBaseUrl = getBaseUrl(httpRequest);
        Vehicle created = vehicleService.createVehicle(request);
        return ResponseEntity.ok(VehicleResponse.fromEntity(created, serverBaseUrl));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request, HttpServletRequest httpRequest) {
        String serverBaseUrl = getBaseUrl(httpRequest);
        Vehicle updated = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(VehicleResponse.fromEntity(updated, serverBaseUrl));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}



