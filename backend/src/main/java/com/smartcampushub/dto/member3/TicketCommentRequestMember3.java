package com.smartcampushub.dto.member3;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketCommentRequestMember3 {
    @NotBlank(message = "Comment message is required")
    private String message;
}
