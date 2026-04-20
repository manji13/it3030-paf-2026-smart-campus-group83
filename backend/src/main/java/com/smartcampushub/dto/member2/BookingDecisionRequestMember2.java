package com.smartcampushub.dto.member2;

import com.smartcampushub.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingDecisionRequestMember2 {
    @NotNull(message = "Decision status is required")
    private BookingStatus status;
    private String rejectionReason;
}
