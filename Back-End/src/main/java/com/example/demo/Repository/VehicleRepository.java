package com.example.demo.Repository;

import com.example.demo.Entity.Vehicle;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    
    /**
     * Load vehicle với photos
     */
    @EntityGraph(attributePaths = {"photos"})
    @Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    Optional<Vehicle> findByIdWithPhotos(Long id);
    
    /**
     * Load tất cả vehicles với photos
     */
    @EntityGraph(attributePaths = {"photos"})
    @Query("SELECT v FROM Vehicle v")
    List<Vehicle> findAllWithPhotos();
    
    /**
     * Load vehicles với photos theo specification (cho search)
     */
    @EntityGraph(attributePaths = {"photos"})
    @Query("SELECT DISTINCT v FROM Vehicle v")
    List<Vehicle> findAllWithPhotosForSearch();
}



