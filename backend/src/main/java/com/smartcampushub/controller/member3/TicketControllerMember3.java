package com.smartcampushub.controller.member3;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.common.util.SecurityUtils;
import com.smartcampushub.dto.member3.*;
import com.smartcampushub.dto.member3.TicketResponseMember3;
import com.smartcampushub.enums.TicketStatus;
import com.smartcampushub.service.member3.TicketServiceMember3;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/member3/tickets")
@RequiredArgsConstructor
public class TicketControllerMember3 {

    private final TicketServiceMember3 ticketServiceMember3;
    private final SecurityUtils securityUtils;

    @PostMapping(consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> createTicket(
            @RequestPart("ticket") @Valid TicketCreateRequestMember3 request,
            @RequestPart(value = "images", required = false) List<org.springframework.web.multipart.MultipartFile> images
    ) {
        String userId = securityUtils.currentUserId();
        TicketResponseMember3 created = ticketServiceMember3.createTicket(userId, request, images);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Ticket created successfully", created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<TicketResponseMember3>>> listTickets(
            @RequestParam(required = false) TicketStatus status,
            @RequestParam(defaultValue = "false") boolean mine,
            Authentication authentication
    ) {
        boolean isAdminOrTechnician = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> "ROLE_ADMIN".equals(role) || "ROLE_TECHNICIAN".equals(role));

        String createdBy = (mine || !isAdminOrTechnician) ? securityUtils.currentUserId() : null;
        return ResponseEntity.ok(ApiResponse.ok("Tickets fetched successfully", ticketServiceMember3.listTickets(createdBy, status)));
    }

    @GetMapping("/{ticketId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> getTicketById(@PathVariable String ticketId) {
        return ResponseEntity.ok(ApiResponse.ok("Ticket fetched successfully", ticketServiceMember3.getTicketById(ticketId)));
    }

    @PatchMapping("/{ticketId}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> assignTechnician(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketAssignRequestMember3 request
    ) {
        TicketResponseMember3 updated = ticketServiceMember3.assignTechnician(ticketId, request.getAssignedTechnicianId());
        return ResponseEntity.ok(ApiResponse.ok("Technician assigned successfully", updated));
    }

    @PatchMapping("/{ticketId}/status")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> updateTicketStatus(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketStatusUpdateRequestMember3 request
    ) {
        TicketResponseMember3 updated = ticketServiceMember3.updateStatus(ticketId, request);
        return ResponseEntity.ok(ApiResponse.ok("Ticket status updated successfully", updated));
    }

    @PatchMapping("/{ticketId}/resolution")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> addResolutionNotes(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketResolutionRequestMember3 request
    ) {
        TicketResponseMember3 updated = ticketServiceMember3.addResolutionNotes(ticketId, request);
        return ResponseEntity.ok(ApiResponse.ok("Resolution notes added successfully", updated));
    }

    @PostMapping("/{ticketId}/comments")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> addComment(
            @PathVariable String ticketId,
            @Valid @RequestBody TicketCommentRequestMember3 request
    ) {
        String userId = securityUtils.currentUserId();
        TicketResponseMember3 updated = ticketServiceMember3.addComment(ticketId, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Comment added successfully", updated));
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<TicketResponseMember3>> updateComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            @Valid @RequestBody TicketCommentUpdateRequestMember3 request,
            Authentication authentication
    ) {
        String userId = securityUtils.currentUserId();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        TicketResponseMember3 updated = ticketServiceMember3.updateComment(ticketId, commentId, userId, isAdmin, request);
        return ResponseEntity.ok(ApiResponse.ok("Comment updated successfully", updated));
    }

    @DeleteMapping("/{ticketId}/comments/{commentId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<Object>> deleteComment(
            @PathVariable String ticketId,
            @PathVariable String commentId,
            Authentication authentication
    ) {
        String userId = securityUtils.currentUserId();
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
        ticketServiceMember3.deleteComment(ticketId, commentId, userId, isAdmin);
        return ResponseEntity.ok(ApiResponse.ok("Comment deleted successfully", null));
    }
}
