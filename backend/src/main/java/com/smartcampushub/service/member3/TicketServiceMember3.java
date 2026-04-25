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
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketServiceMember3 {

    private final TicketRepositoryMember3 ticketRepositoryMember3;
    private final NotificationServiceMember4 notificationServiceMember4;
    private final UserRepositoryMember4 userRepositoryMember4;
    private final MongoTemplate mongoTemplate;

    public TicketResponseMember3 createTicket(String userId, TicketCreateRequestMember3 request) {
        if ((request.getResourceId() == null || request.getResourceId().isBlank())
                && (request.getLocation() == null || request.getLocation().isBlank())) {
            throw new BusinessException("Either resourceId or location must be provided");
        }

        Ticket ticket = Ticket.builder()
                .resourceId(blankToNull(request.getResourceId()))
                .location(blankToNull(request.getLocation()))
                .category(request.getCategory().trim())
                .description(request.getDescription().trim())
                .priority(request.getPriority())
                .preferredContact(request.getPreferredContact().trim())
                .attachments(mapAttachments(request.getAttachments()))
                .status(TicketStatus.OPEN)
                .createdBy(userId)
                .build();

        return mapToResponse(ticketRepositoryMember3.save(ticket));
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
        return mapToResponse(ticketRepositoryMember3.save(ticket));
    }

    public TicketResponseMember3 updateStatus(String ticketId, TicketStatusUpdateRequestMember3 request) {
        Ticket ticket = getTicketEntity(ticketId);
        ticket.setStatus(request.getStatus());
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepositoryMember3.save(ticket);
        notificationServiceMember4.createNotification(
                saved.getCreatedBy(),
                "Ticket Status Updated",
                "Your ticket status is now: " + saved.getStatus(),
                NotificationType.TICKET_STATUS_CHANGED
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
        String authorName = userRepositoryMember4.findById(userId)
            .map(user -> user.getFullName() != null ? user.getFullName() : user.getEmail())
            .orElse(userId);

        TicketComment comment = TicketComment.builder()
                .id(UUID.randomUUID().toString())
                .authorUserId(userId)
                .authorDisplayName(authorName)
                .message(request.getMessage().trim())
                .build();

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepositoryMember3.save(ticket);

        if (!saved.getCreatedBy().equals(userId)) {
            notificationServiceMember4.createNotification(
                    saved.getCreatedBy(),
                    "New Ticket Comment",
                    "A new comment was added to your ticket.",
                    NotificationType.TICKET_COMMENT_ADDED
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
        return TicketResponseMember3.builder()
                .id(ticket.getId())
                .resourceId(ticket.getResourceId())
                .location(ticket.getLocation())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .preferredContact(ticket.getPreferredContact())
                .attachments(ticket.getAttachments())
                .status(ticket.getStatus())
                .assignedTechnicianId(ticket.getAssignedTechnicianId())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdBy(ticket.getCreatedBy())
                .comments(ticket.getComments())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
