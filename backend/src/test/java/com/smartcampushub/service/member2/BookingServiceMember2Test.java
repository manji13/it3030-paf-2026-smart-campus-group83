package com.smartcampushub.service.member2;

import com.smartcampushub.common.exception.ConflictException;
import com.smartcampushub.dto.member2.BookingCreateRequestMember2;
import com.smartcampushub.enums.BookingStatus;
import com.smartcampushub.enums.ResourceStatus;
import com.smartcampushub.model.member1.Resource;
import com.smartcampushub.model.member2.Booking;
import com.smartcampushub.repository.member1.ResourceRepositoryMember1;
import com.smartcampushub.repository.member2.BookingRepositoryMember2;
import com.smartcampushub.service.member4.NotificationServiceMember4;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceMember2Test {

    @Mock
    private BookingRepositoryMember2 bookingRepositoryMember2;

    @Mock
    private ResourceRepositoryMember1 resourceRepositoryMember1;

    @Mock
    private NotificationServiceMember4 notificationServiceMember4;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private BookingServiceMember2 bookingServiceMember2;

    private BookingCreateRequestMember2 request;

    @BeforeEach
    void setUp() {
        request = new BookingCreateRequestMember2();
        request.setResourceId("resource-1");
        request.setDate(LocalDate.of(2026, 4, 20));
        request.setStartTime(LocalTime.of(10, 0));
        request.setEndTime(LocalTime.of(11, 0));
        request.setPurpose("Group discussion");
        request.setExpectedAttendees(20);
    }

    @Test
    void createBooking_shouldThrowConflict_whenTimeOverlaps() {
        Resource resource = Resource.builder()
                .id("resource-1")
                .capacity(40)
                .status(ResourceStatus.ACTIVE)
                .build();

        Booking existing = Booking.builder()
                .id("booking-existing")
                .resourceId("resource-1")
                .date(request.getDate())
                .startTime(LocalTime.of(10, 30))
                .endTime(LocalTime.of(11, 30))
                .status(BookingStatus.APPROVED)
                .build();

        when(resourceRepositoryMember1.findById("resource-1")).thenReturn(Optional.of(resource));
        when(bookingRepositoryMember2.findByResourceIdAndDateAndStatusIn(anyString(), any(), any()))
                .thenReturn(List.of(existing));

        assertThrows(ConflictException.class, () -> bookingServiceMember2.createBooking("user-1", request));
    }

    @Test
    void createBooking_shouldCreatePendingBooking_whenNoConflict() {
        Resource resource = Resource.builder()
                .id("resource-1")
                .capacity(40)
                .status(ResourceStatus.ACTIVE)
                .build();

        Booking saved = Booking.builder()
                .id("booking-1")
                .resourceId(request.getResourceId())
                .userId("user-1")
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .expectedAttendees(request.getExpectedAttendees())
                .status(BookingStatus.PENDING)
                .build();

        when(resourceRepositoryMember1.findById("resource-1")).thenReturn(Optional.of(resource));
        when(bookingRepositoryMember2.findByResourceIdAndDateAndStatusIn(anyString(), any(), any()))
                .thenReturn(List.of());
        when(bookingRepositoryMember2.save(any(Booking.class))).thenReturn(saved);

        var response = bookingServiceMember2.createBooking("user-1", request);

        assertEquals("booking-1", response.getId());
        assertEquals(BookingStatus.PENDING, response.getStatus());
    }
}
