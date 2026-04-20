package com.smartcampushub.controller.member2;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.common.util.SecurityUtils;
import com.smartcampushub.dto.member2.BookingCreateRequestMember2;
import com.smartcampushub.dto.member2.BookingDecisionRequestMember2;
import com.smartcampushub.dto.member2.BookingResponseMember2;
import com.smartcampushub.enums.BookingStatus;
import com.smartcampushub.service.member2.BookingServiceMember2;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/member2/bookings")
@RequiredArgsConstructor
public class BookingControllerMember2 {

    private final BookingServiceMember2 bookingServiceMember2;
    private final SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponseMember2>> createBooking(
            @Valid @RequestBody BookingCreateRequestMember2 request
    ) {
        String userId = securityUtils.currentUserId();
        BookingResponseMember2 created = bookingServiceMember2.createBooking(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking request created successfully", created));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponseMember2>>> getMyBookings() {
        String userId = securityUtils.currentUserId();
        return ResponseEntity.ok(ApiResponse.ok("My bookings fetched successfully", bookingServiceMember2.getMyBookings(userId)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingResponseMember2>>> getAllBookingsForAdmin(
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(required = false) LocalDate date
    ) {
        List<BookingResponseMember2> data = bookingServiceMember2.getAllBookingsForAdmin(resourceId, userId, status, date);
        return ResponseEntity.ok(ApiResponse.ok("Admin booking list fetched successfully", data));
    }

    @PatchMapping("/{bookingId}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponseMember2>> decideBooking(
            @PathVariable String bookingId,
            @Valid @RequestBody BookingDecisionRequestMember2 request
    ) {
        BookingResponseMember2 updated = bookingServiceMember2.decideBooking(bookingId, request);
        return ResponseEntity.ok(ApiResponse.ok("Booking decision processed", updated));
    }

    @PatchMapping("/{bookingId}/cancel")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<BookingResponseMember2>> cancelBooking(
            @PathVariable String bookingId,
            Authentication authentication
    ) {
        String currentUserId = securityUtils.currentUserId();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);

        BookingResponseMember2 cancelled = bookingServiceMember2.cancelApprovedBooking(bookingId, currentUserId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", cancelled));
    }
}
