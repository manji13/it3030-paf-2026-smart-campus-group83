package com.sliit.smartcampus.controller.member2;

import com.sliit.smartcampus.dto.member2.AdminReviewDTO;
import com.sliit.smartcampus.dto.member2.BookingRequestDTO;
import com.sliit.smartcampus.dto.member2.BookingResponseDTO;
import com.sliit.smartcampus.service.member2.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO requestDTO,
            @RequestHeader("X-User-Id") String userId) {
        BookingResponseDTO response = bookingService.createBooking(requestDTO, userId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<BookingResponseDTO> reviewBooking(
            @PathVariable String id,
            @Valid @RequestBody AdminReviewDTO adminReviewDTO) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, adminReviewDTO));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String id,
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }
}
