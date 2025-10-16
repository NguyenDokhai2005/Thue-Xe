package com.example.demo.Controller;

import com.example.demo.DTO.BookingCreateRequest;
import com.example.demo.DTO.BookingResponse;
import com.example.demo.Entity.Booking;
import com.example.demo.Service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingCreateRequest request) {
        Booking created = bookingService.createBooking(request);
        return ResponseEntity.ok(BookingResponse.fromEntity(created));
    }

    @GetMapping("/me")
    public List<BookingResponse> myBookings() {
        return bookingService.getMyBookings().stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.confirm(id)));
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> activate(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.activate(id)));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.complete(id)));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.cancel(id)));
    }
}


