package com.smartcampushub.service.member3;

import com.smartcampushub.common.exception.BusinessException;
import com.smartcampushub.common.exception.ForbiddenOperationException;
import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member3.*;
import com.smartcampushub.enums.NotificationType;
import com.smartcampushub.enums.TicketStatus;
import com.smartcampushub.model.member3.Ticket;
import com.smartcampushub.model.member3.TicketAttachment;
import com.smartcampushub.model.member3.TicketComment;
import com.smartcampushub.model.member4.User;
import com.smartcampushub.repository.member3.TicketRepositoryMember3;
import com.smartcampushub.repository.member4.UserRepositoryMember4;
import com.smartcampushub.service.member4.NotificationServiceMember4;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceMember3 {

    private final TicketRepositoryMember3 ticketRepositoryMember3;
    private final NotificationServiceMember4 notificationServiceMember4;
    private final UserRepositoryMember4 userRepositoryMember4;
    private final ImageStorageService imageStorageService;
    private final MongoTemplate mongoTemplate;

    public TicketResponseMember3 createTicket(String userId, TicketCreateRequestMember3 request, List<org.springframework.web.multipart.MultipartFile> images) {
        if ((request.getResourceId() == null || request.getResourceId().isBlank())
                && (request.getLocation() == null || request.getLocation().isBlank())) {
            throw new BusinessException("Either resourceId or location must be provided");
        }

        List<TicketAttachment> attachments = new ArrayList<>();
        if (images != null && !images.isEmpty()) {
            try {
                List<String> savedUrls = imageStorageService.saveImages(images);
                for (String url : savedUrls) {
                    attachments.add(TicketAttachment.builder()
                            .fileUrl(url)
                            .fileName(url.substring(url.lastIndexOf("/") + 1))
                            .contentType("image/jpeg") // simplification
                            .build());
                }
            } catch (Exception e) {
                System.err.println("Failed to save images: " + e.getMessage());
            }
        } else if (request.getAttachments() != null && !request.getAttachments().isEmpty()) {
            attachments.addAll(mapAttachments(request.getAttachments()));
        }

        Ticket ticket = Ticket.builder()
                .resourceId(blankToNull(request.getResourceId()))
                .location(blankToNull(request.getLocation()))
                .category(request.getCategory().trim())
                .description(request.getDescription().trim())
                .priority(request.getPriority())
                .preferredContact(request.getPreferredContact().trim())
                .attachments(attachments)
                .status(TicketStatus.OPEN)
                .createdBy(userId)
                .build();

        Ticket saved = ticketRepositoryMember3.save(ticket);
        
        // Notify Admins
        try {
            userRepositoryMember4.findByRolesContains(com.smartcampushub.enums.UserRole.ADMIN).forEach(admin -> {
                notificationServiceMember4.createNotification(
                        admin.getId(),
                        "New Ticket Created",
                        "A new ticket has been created: " + saved.getCategory(),
                        NotificationType.TICKET_CREATED,
                        "/ticketList"
                );
            });
        } catch (Exception e) {
            // Log error but don't fail ticket creation
            System.err.println("Failed to send admin notifications: " + e.getMessage());
        }

        return mapToResponse(saved);
    }

    public List<TicketResponseMember3> listTickets(String createdBy, TicketStatus status) {
        Query query = new Query();
        if (createdBy != null && !createdBy.isBlank()) {
            query.addCriteria(Criteria.where("createdBy").is(createdBy));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, Ticket.class).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TicketResponseMember3 getTicketById(String ticketId) {
        return mapToResponse(getTicketEntity(ticketId));
    }

    public TicketResponseMember3 assignTechnician(String ticketId, String technicianId) {
        Ticket ticket = getTicketEntity(ticketId);
        ticket.setAssignedTechnicianId(technicianId);
        ticket.setUpdatedAt(Instant.now());
        Ticket saved = ticketRepositoryMember3.save(ticket);

        // Notify Technician
        notificationServiceMember4.createNotification(
                technicianId,
                "New Ticket Assigned",
                "You have been assigned to a new ticket: " + saved.getCategory(),
                NotificationType.TICKET_ASSIGNED,
                "/technician-tickets"
        );

        // Notify Creator
        notificationServiceMember4.createNotification(
                saved.getCreatedBy(),
                "Technician Assigned",
                "A technician has been assigned to your ticket: " + saved.getCategory(),
                NotificationType.TICKET_ASSIGNED,
                "/my-tickets"
        );

        return mapToResponse(saved);
    }

    public TicketResponseMember3 updateStatus(String ticketId, TicketStatusUpdateRequestMember3 request) {
        Ticket ticket = getTicketEntity(ticketId);
        ticket.setStatus(request.getStatus());
        if (request.getResolutionNotes() != null) {
            ticket.setResolutionNotes(request.getResolutionNotes().trim());
        }
        if (request.getRejectionReason() != null) {
            ticket.setRejectionReason(request.getRejectionReason().trim());
        }
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepositoryMember3.save(ticket);
        
        String actionInfo = "";
        if (saved.getStatus() == TicketStatus.RESOLVED) actionInfo = " (Resolution: " + saved.getResolutionNotes() + ")";
        if (saved.getStatus() == TicketStatus.REJECTED) actionInfo = " (Reason: " + saved.getRejectionReason() + ")";

        notificationServiceMember4.createNotification(
                saved.getCreatedBy(),
                "Ticket Action: " + saved.getStatus(),
                "Technician updated your ticket for " + saved.getCategory() + actionInfo,
                NotificationType.TICKET_STATUS_CHANGED,
                "/my-tickets"
        );
        return mapToResponse(saved);
    }

    public TicketResponseMember3 addResolutionNotes(String ticketId, TicketResolutionRequestMember3 request) {
        Ticket ticket = getTicketEntity(ticketId);
        ticket.setResolutionNotes(request.getResolutionNotes().trim());
        ticket.setUpdatedAt(Instant.now());
        return mapToResponse(ticketRepositoryMember3.save(ticket));
    }

    public TicketResponseMember3 addComment(String ticketId, String userId, TicketCommentRequestMember3 request) {
        Ticket ticket = getTicketEntity(ticketId);
        String authorName = userRepositoryMember4.findById(userId).map(User::getName).orElse(userId);

        TicketComment comment = TicketComment.builder()
                .id(UUID.randomUUID().toString())
                .authorUserId(userId)
                .authorDisplayName(authorName)
                .message(request.getMessage().trim())
                .build();

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepositoryMember3.save(ticket);

        // Notify counterparty
        if (saved.getCreatedBy().equals(userId)) {
            // User commented, notify technician if assigned
            if (saved.getAssignedTechnicianId() != null) {
                notificationServiceMember4.createNotification(
                        saved.getAssignedTechnicianId(),
                        "New Comment from User",
                        authorName + ": " + (request.getMessage().length() > 50 ? request.getMessage().substring(0, 47) + "..." : request.getMessage()),
                        NotificationType.TICKET_COMMENT_ADDED,
                        "/technician-tickets"
                );
            }
        } else {
            // Technician (or admin) commented, notify creator
            notificationServiceMember4.createNotification(
                    saved.getCreatedBy(),
                    "New Comment from Technician",
                    authorName + ": " + (request.getMessage().length() > 50 ? request.getMessage().substring(0, 47) + "..." : request.getMessage()),
                    NotificationType.TICKET_COMMENT_ADDED,
                    "/my-tickets"
            );
        }

        return mapToResponse(saved);
    }

    public TicketResponseMember3 updateComment(String ticketId, String commentId, String userId, boolean isAdmin, TicketCommentUpdateRequestMember3 request) {
        Ticket ticket = getTicketEntity(ticketId);
        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        if (!isAdmin && !comment.getAuthorUserId().equals(userId)) {
            throw new ForbiddenOperationException("Only the comment owner or an admin can edit this comment");
        }

        comment.setMessage(request.getMessage().trim());
        comment.setUpdatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        return mapToResponse(ticketRepositoryMember3.save(ticket));
    }

    public void deleteComment(String ticketId, String commentId, String userId, boolean isAdmin) {
        Ticket ticket = getTicketEntity(ticketId);
        TicketComment comment = ticket.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        if (!isAdmin && !comment.getAuthorUserId().equals(userId)) {
            throw new ForbiddenOperationException("Only the comment owner or an admin can delete this comment");
        }

        ticket.getComments().remove(comment);
        ticket.setUpdatedAt(Instant.now());
        ticketRepositoryMember3.save(ticket);
    }

    private Ticket getTicketEntity(String ticketId) {
        return ticketRepositoryMember3.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found: " + ticketId));
    }

    private List<TicketAttachment> mapAttachments(List<TicketAttachmentRequestMember3> attachments) {
        return attachments.stream()
                .map(a -> TicketAttachment.builder()
                        .fileName(a.getFileName())
                        .fileUrl(a.getFileUrl())
                        .contentType(a.getContentType())
                        .build())
                .toList();
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private TicketResponseMember3 mapToResponse(Ticket ticket) {
        String techName = null;
        String techEmail = null;

        if (ticket.getAssignedTechnicianId() != null) {
            var tech = userRepositoryMember4.findById(ticket.getAssignedTechnicianId());
            if (tech.isPresent()) {
                techName = tech.get().getName();
                techEmail = tech.get().getEmail();
            }
        }

        String creatorName = "Unknown";
        if (ticket.getCreatedBy() != null) {
            creatorName = userRepositoryMember4.findById(ticket.getCreatedBy())
                    .map(User::getName)
                    .orElse("Unknown User");
        }

        List<String> imageUrls = ticket.getAttachments().stream()
                .map(TicketAttachment::getFileUrl)
                .toList();

        return TicketResponseMember3.builder()
                .id(ticket.getId())
                .resourceId(ticket.getResourceId())
                .location(ticket.getLocation())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContact(ticket.getPreferredContact())
                .attachments(ticket.getAttachments())
                .imageUrls(imageUrls)
                .status(ticket.getStatus())
                .assignedTechnicianId(ticket.getAssignedTechnicianId())
                .assignedTo(techName)
                .assignedToEmail(techEmail)
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .createdBy(ticket.getCreatedBy())
                .creatorName(creatorName)
                .comments(ticket.getComments())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
