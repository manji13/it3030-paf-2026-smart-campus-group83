package com.smartcampushub.dto.member3;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketResolutionRequestMember3 {
    @NotBlank(message = "Resolution notes are required")
    private String resolutionNotes;
}
