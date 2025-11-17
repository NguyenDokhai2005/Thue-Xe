package com.example.demo.Service;

import com.example.demo.DTO.BookingCreateRequest;
import com.example.demo.Entity.Booking;
import com.example.demo.Entity.User;
import com.example.demo.Entity.Vehicle;
import com.example.demo.Repository.BookingRepository;
import com.example.demo.Repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserService userService;

    public Booking createBooking(BookingCreateRequest req) {
        if (req.getStartAt().isAfter(req.getEndAt()) || req.getStartAt().isEqual(req.getEndAt())) {
            throw new RuntimeException("Thời gian không hợp lệ: startAt phải trước endAt");
        }

        Vehicle vehicle = vehicleRepository.findById(req.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle không tồn tại!"));

        // Check overlaps for active-like statuses
        List<Booking> overlaps = bookingRepository.findOverlaps(vehicle, req.getStartAt(), req.getEndAt());
        if (!overlaps.isEmpty()) {
            throw new RuntimeException("Xe đã được đặt trong khoảng thời gian này");
        }

        // Current user as renter
        User renter = userService.getCurrentUser();

        // Calculate days (ceil to at least 1 day)
        long minutes = Duration.between(req.getStartAt(), req.getEndAt()).toMinutes();
        long days = Math.max(1, (long) Math.ceil(minutes / (60.0 * 24.0)));

        BigDecimal dailyPriceSnapshot = vehicle.getDailyPrice();
        BigDecimal totalAmount = dailyPriceSnapshot.multiply(BigDecimal.valueOf(days));

        Booking booking = new Booking();
        booking.setVehicle(vehicle);
        booking.setRenter(renter);
        booking.setStartAt(req.getStartAt());
        booking.setEndAt(req.getEndAt());
        booking.setDailyPriceSnapshot(dailyPriceSnapshot);
        booking.setTotalAmount(totalAmount);
        booking.setCurrency(vehicle.getCurrency());
        booking.setNotes(req.getNotes());

        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User chưa đăng nhập!");
        }
        User current = userService.getCurrentUser();
        // Admin có thể xem tất cả bookings
        if (current.getRole() == User.Role.ADMIN) {
            return bookingRepository.findAllByOrderByCreatedAtDesc();
        }
        return bookingRepository.findByRenterIdOrderByCreatedAtDesc(current.getId());
    }

    public Booking getForOwnerOrAdmin(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại!"));
        User current = userService.getCurrentUser();
        boolean isAdmin = current.getRole() == User.Role.ADMIN;
        if (!isAdmin && !booking.getRenter().getId().equals(current.getId())) {
            throw new RuntimeException("Không có quyền truy cập booking này");
        }
        return booking;
    }

    public Booking confirm(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại!"));
        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Chỉ xác nhận booking ở trạng thái PENDING");
        }
        // Kiểm tra trạng thái xe: chỉ cho phép khi xe đang AVAILABLE
        Vehicle vehicle = booking.getVehicle();
        if (vehicle.getStatus() != Vehicle.VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Xe hiện không sẵn sàng: " + vehicle.getStatus());
        }
        // Move directly to ACTIVE and mark vehicle as RENTED
        booking.setStatus(Booking.BookingStatus.ACTIVE);
        vehicle.setStatus(Vehicle.VehicleStatus.RENTED);
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }

    public Booking activate(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại!"));
        if (booking.getStatus() != Booking.BookingStatus.CONFIRMED) {
            throw new RuntimeException("Chỉ kích hoạt booking ở trạng thái CONFIRMED");
        }
        // Kiểm tra trạng thái xe: chỉ cho phép khi xe đang AVAILABLE
        Vehicle vehicle = booking.getVehicle();
        if (vehicle.getStatus() != Vehicle.VehicleStatus.AVAILABLE) {
            throw new RuntimeException("Xe hiện không sẵn sàng: " + vehicle.getStatus());
        }
        booking.setStatus(Booking.BookingStatus.ACTIVE);
        // Sync vehicle status
        vehicle.setStatus(Vehicle.VehicleStatus.RENTED);
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }

    public Booking complete(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại!"));
        if (booking.getStatus() != Booking.BookingStatus.ACTIVE) {
            throw new RuntimeException("Chỉ hoàn tất booking ở trạng thái ACTIVE");
        }
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        // Release vehicle
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }

    public Booking cancel(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking không tồn tại!"));
        User current = userService.getCurrentUser();
        boolean isAdmin = current.getRole() == User.Role.ADMIN;
        boolean isOwner = booking.getRenter().getId().equals(current.getId());
        if (!isAdmin) {
            // Renter can cancel only if they are owner and before start time and not ACTIVE/COMPLETED
            if (!isOwner) {
                throw new RuntimeException("Bạn không có quyền hủy booking này");
            }
            switch (booking.getStatus()) {
                case PENDING, CONFIRMED -> {
                    // allowed before start
                }
                default -> throw new RuntimeException("Không thể hủy ở trạng thái hiện tại");
            }
        }
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        // Release vehicle if was active (defensive)
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }
}


