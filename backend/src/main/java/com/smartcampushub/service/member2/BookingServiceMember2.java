package com.smartcampushub.service.member2;

import com.smartcampushub.common.exception.BusinessException;
import com.smartcampushub.common.exception.ConflictException;
import com.smartcampushub.common.exception.ForbiddenOperationException;
import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member2.BookingCreateRequestMember2;
import com.smartcampushub.dto.member2.BookingDecisionRequestMember2;
import com.smartcampushub.dto.member2.BookingResponseMember2;
import com.smartcampushub.enums.BookingStatus;
import com.smartcampushub.enums.NotificationType;
import com.smartcampushub.enums.ResourceStatus;
import com.smartcampushub.model.member1.Resource;
import com.smartcampushub.model.member2.Booking;
import com.smartcampushub.repository.member1.ResourceRepositoryMember1;
import com.smartcampushub.repository.member2.BookingRepositoryMember2;
import com.smartcampushub.service.member4.NotificationServiceMember4;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingServiceMember2 {

    private final BookingRepositoryMember2 bookingRepositoryMember2;
    private final ResourceRepositoryMember1 resourceRepositoryMember1;
    private final NotificationServiceMember4 notificationServiceMember4;
    private final MongoTemplate mongoTemplate;

    public BookingResponseMember2 createBooking(String userId, BookingCreateRequestMember2 request) {
        validateTimeRange(request);

        Resource resource = resourceRepositoryMember1.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + request.getResourceId()));

        if (resource.getStatus() != ResourceStatus.ACTIVE) {
            throw new BusinessException("Resource is out of service and cannot be booked");
        }

        if (request.getExpectedAttendees() > resource.getCapacity()) {
            throw new BusinessException("Expected attendees exceed resource capacity");
        }

        ensureNoOverlappingBooking(request.getResourceId(), request.getDate(), request.getStartTime().toString(), request.getEndTime().toString());

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(userId)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose().trim())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        return mapToResponse(bookingRepositoryMember2.save(booking));
    }

    public List<BookingResponseMember2> getMyBookings(String userId) {
        return bookingRepositoryMember2.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<BookingResponseMember2> getAllBookingsForAdmin(String resourceId, String userId, BookingStatus status, LocalDate date) {
        Query query = new Query();
        if (resourceId != null && !resourceId.isBlank()) {
            query.addCriteria(Criteria.where("resourceId").is(resourceId));
        }
        if (userId != null && !userId.isBlank()) {
            query.addCriteria(Criteria.where("userId").is(userId));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        if (date != null) {
            query.addCriteria(Criteria.where("date").is(date));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, Booking.class).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookingResponseMember2 decideBooking(String bookingId, BookingDecisionRequestMember2 request) {
        Booking booking = bookingRepositoryMember2.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BusinessException("Only PENDING bookings can be approved or rejected");
        }

        if (request.getStatus() != BookingStatus.APPROVED && request.getStatus() != BookingStatus.REJECTED) {
            throw new BusinessException("Decision status must be APPROVED or REJECTED");
        }

        booking.setStatus(request.getStatus());
        booking.setUpdatedAt(Instant.now());

        if (request.getStatus() == BookingStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().isBlank()) {
                throw new BusinessException("Rejection reason is required when rejecting a booking");
            }
            booking.setRejectionReason(request.getRejectionReason().trim());
            notificationServiceMember4.createNotification(
                    booking.getUserId(),
                    "Booking Rejected",
                    "Your booking request was rejected. Reason: " + booking.getRejectionReason(),
                    NotificationType.BOOKING_REJECTED
            );
        } else {
            booking.setRejectionReason(null);
            notificationServiceMember4.createNotification(
                    booking.getUserId(),
                    "Booking Approved",
                    "Your booking request has been approved.",
                    NotificationType.BOOKING_APPROVED
            );
        }

        return mapToResponse(bookingRepositoryMember2.save(booking));
    }

    public BookingResponseMember2 cancelApprovedBooking(String bookingId, String currentUserId, boolean isAdmin) {
        Booking booking = bookingRepositoryMember2.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        if (!isAdmin && !booking.getUserId().equals(currentUserId)) {
            throw new ForbiddenOperationException("You are not allowed to cancel this booking");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new BusinessException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(Instant.now());

        return mapToResponse(bookingRepositoryMember2.save(booking));
    }

    public void deleteBooking(String bookingId) {
        Booking booking = bookingRepositoryMember2.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        bookingRepositoryMember2.delete(booking);
    }

    private void validateTimeRange(BookingCreateRequestMember2 request) {
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BusinessException("Start time must be before end time");
        }
    }

    private void ensureNoOverlappingBooking(String resourceId, LocalDate date, String startTime, String endTime) {
        List<Booking> activeBookings = bookingRepositoryMember2.findByResourceIdAndDateAndStatusIn(
                resourceId,
                date,
                Set.of(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        for (Booking existing : activeBookings) {
            // Overlap rule: [newStart, newEnd) overlaps [existingStart, existingEnd) iff
            // newStart < existingEnd AND existingStart < newEnd.
            boolean overlaps = startTime.compareTo(existing.getEndTime().toString()) < 0
                    && existing.getStartTime().toString().compareTo(endTime) < 0;
            if (overlaps) {
                throw new ConflictException("Booking conflicts with an existing booking on the same resource and time range");
            }
        }
    }

    private BookingResponseMember2 mapToResponse(Booking booking) {
        return BookingResponseMember2.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .userId(booking.getUserId())
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees())
                .status(booking.getStatus())
                .rejectionReason(booking.getRejectionReason())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
