package com.smartcampushub.dto.member3;

import com.smartcampushub.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketStatusUpdateRequestMember3 {
    @NotNull(message = "Ticket status is required")
    private TicketStatus status;
}
