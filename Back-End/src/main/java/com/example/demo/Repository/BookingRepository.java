package com.example.demo.Repository;

import com.example.demo.Entity.Booking;
import com.example.demo.Entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.vehicle = :vehicle AND b.status IN (com.example.demo.Entity.Booking$BookingStatus.PENDING, com.example.demo.Entity.Booking$BookingStatus.CONFIRMED, com.example.demo.Entity.Booking$BookingStatus.ACTIVE) AND (:startAt < b.endAt AND :endAt > b.startAt)")
    List<Booking> findOverlaps(@Param("vehicle") Vehicle vehicle,
                               @Param("startAt") LocalDateTime startAt,
                               @Param("endAt") LocalDateTime endAt);

    List<Booking> findByRenterIdOrderByCreatedAtDesc(Long renterId);
    
    List<Booking> findAllByOrderByCreatedAtDesc();
}







