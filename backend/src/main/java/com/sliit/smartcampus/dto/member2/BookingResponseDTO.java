package com.sliit.smartcampus.dto.member2;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingResponseDTO {
    private String id;
    private String userId;
    private String resourceId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private Integer expectedAttendees;
    private String status;
    private String adminReason;
}
