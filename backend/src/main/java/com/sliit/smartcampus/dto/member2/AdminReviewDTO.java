package com.sliit.smartcampus.dto.member2;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class AdminReviewDTO {
    @NotBlank(message = "Status is required")
    private String status; // APPROVED or REJECTED
    
    private String reason; // Reason for rejection or approval notes
}
