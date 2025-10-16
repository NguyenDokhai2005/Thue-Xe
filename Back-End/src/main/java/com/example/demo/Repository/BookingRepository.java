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

    @Query("select b from Booking b where b.vehicle = :vehicle and b.status in (com.example.demo.Entity.Booking$Status.CONFIRMED, com.example.demo.Entity.Booking$Status.ACTIVE) and (b.startAt < :endAt and b.endAt > :startAt)")
    List<Booking> findOverlaps(@Param("vehicle") Vehicle vehicle,
                               @Param("startAt") LocalDateTime startAt,
                               @Param("endAt") LocalDateTime endAt);
}



