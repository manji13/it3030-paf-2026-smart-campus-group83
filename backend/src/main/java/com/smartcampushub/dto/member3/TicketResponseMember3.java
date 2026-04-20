package com.smartcampushub.dto.member3;

import com.smartcampushub.enums.TicketPriority;
import com.smartcampushub.enums.TicketStatus;
import com.smartcampushub.model.member3.TicketAttachment;
import com.smartcampushub.model.member3.TicketComment;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class TicketResponseMember3 {
    private String id;
    private String resourceId;
    private String location;
    private String category;
    private String description;
    private TicketPriority priority;
    private String preferredContact;
    private List<TicketAttachment> attachments;
    private TicketStatus status;
    private String assignedTechnicianId;
    private String resolutionNotes;
    private String createdBy;
    private List<TicketComment> comments;
    private Instant createdAt;
    private Instant updatedAt;
}
