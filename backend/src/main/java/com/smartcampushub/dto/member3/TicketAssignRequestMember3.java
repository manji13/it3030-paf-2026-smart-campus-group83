package com.smartcampushub.dto.member3;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketAssignRequestMember3 {
    @NotBlank(message = "Technician id is required")
    private String assignedTechnicianId;
}
