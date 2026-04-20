package com.smartcampushub.dto.member3;

import com.smartcampushub.enums.TicketPriority;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TicketCreateRequestMember3 {
    private String resourceId;
    private String location;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Preferred contact is required")
    private String preferredContact;

    @Valid
    @Size(max = 3, message = "At most 3 attachments are allowed")
    private List<TicketAttachmentRequestMember3> attachments = new ArrayList<>();
}
