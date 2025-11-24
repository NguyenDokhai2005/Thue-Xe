package com.example.demo.Repository;

import com.example.demo.Entity.Vehicle;
import com.example.demo.Entity.VehiclePhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehiclePhotoRepository extends JpaRepository<VehiclePhoto, Long> {
    
    /**
     * Tìm tất cả photos của một vehicle
     */
    List<VehiclePhoto> findByVehicleIdOrderByIsPrimaryDescCreatedAtAsc(Long vehicleId);
    
    /**
     * Tìm primary photo của một vehicle
     */
    Optional<VehiclePhoto> findByVehicleIdAndIsPrimaryTrue(Long vehicleId);
    
    /**
     * Tìm tất cả primary photos
     */
    @Query("SELECT vp FROM VehiclePhoto vp WHERE vp.vehicle = :vehicle AND vp.isPrimary = true")
    List<VehiclePhoto> findPrimaryPhotosByVehicle(@Param("vehicle") Vehicle vehicle);
}

