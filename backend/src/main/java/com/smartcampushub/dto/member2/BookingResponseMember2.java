package com.smartcampushub.dto.member2;

import com.smartcampushub.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class BookingResponseMember2 {
    private String id;
    private String resourceId;
    private String userId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private BookingStatus status;
    private String rejectionReason;
    private Instant createdAt;
    private Instant updatedAt;
}
