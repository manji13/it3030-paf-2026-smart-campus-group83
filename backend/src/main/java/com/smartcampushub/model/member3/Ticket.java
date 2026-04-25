package com.smartcampushub.model.member3;

import com.smartcampushub.enums.TicketPriority;
import com.smartcampushub.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;
    private String resourceId;
    private String location;
    private String category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    @Builder.Default
    private List<TicketAttachment> attachments = new ArrayList<>();
    private TicketStatus status;
    private String assignedTechnicianId;
    private String resolutionNotes;
    private String rejectionReason;
    private String createdBy;
    @Builder.Default
    private List<TicketComment> comments = new ArrayList<>();
    @Builder.Default
    private Instant createdAt = Instant.now();
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
