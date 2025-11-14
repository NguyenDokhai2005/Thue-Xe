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
import java.util.HashMap;
import java.util.Map;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    public ResponseEntity<Map<String, Object>> create(@Valid @RequestBody BookingCreateRequest request) {
        Booking created = bookingService.createBooking(request);

        Map<String, Object> res = new HashMap<>();
        res.put("id", created.getId());
        res.put("message", "Đặt xe thành công");

        return ResponseEntity.status(201).body(res);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    public List<BookingResponse> myBookings() {
        return bookingService.getMyBookings().stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<BookingResponse> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.confirm(id)));
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<BookingResponse> activate(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.activate(id)));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public ResponseEntity<BookingResponse> complete(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.complete(id)));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE') or hasRole('CUSTOMER')")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(BookingResponse.fromEntity(bookingService.cancel(id)));
    }
}


