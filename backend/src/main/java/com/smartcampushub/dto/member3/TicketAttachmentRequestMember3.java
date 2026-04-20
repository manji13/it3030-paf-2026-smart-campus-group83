package com.smartcampushub.dto.member3;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketAttachmentRequestMember3 {
    @NotBlank(message = "File name is required")
    private String fileName;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    private String contentType;
}
