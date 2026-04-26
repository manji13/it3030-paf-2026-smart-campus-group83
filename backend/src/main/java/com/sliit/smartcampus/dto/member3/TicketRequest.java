package com.sliit.smartcampus.dto.member3;

import com.sliit.smartcampus.enums.Priority;
import com.sliit.smartcampus.enums.TicketStatus;
import lombok.Data;

import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class TicketRequest {

    private String userEmail;   // sent from frontend (from localStorage user)

    @NotBlank(message = "Resource is required")
    private String resource;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Contact details are required")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$|^\\+?[0-9. ()-]{7,}$",
        message = "Contact must be a valid email or phone number"
    )
    private String contactDetails;

    @Size(max = 3)
    private List<String> imageUrls;

    // For admin/technician updates only
    private TicketStatus status;
    private String assignedTo;
    private String resolutionNotes;
    private String rejectionReason;
}