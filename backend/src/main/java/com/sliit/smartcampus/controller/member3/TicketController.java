package com.sliit.smartcampus.controller.member3;

import com.sliit.smartcampus.dto.member3.TicketRequest;
import com.sliit.smartcampus.dto.member3.TicketMapper;
import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.enums.TicketStatus;
import com.sliit.smartcampus.service.member3.TicketService;
import com.sliit.smartcampus.service.member3.CommentService;
import com.sliit.smartcampus.service.member3.ImageStorageService;
import com.sliit.smartcampus.service.member4.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;
    private final TicketMapper ticketMapper;
    private final ImageStorageService imageStorageService;
    private final CommentService commentService;
    private final NotificationService notificationService;

    @GetMapping("/test")
    public String test() { return "WORKING"; }

    // Create ticket (JSON)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest request) {
        Ticket ticket = ticketMapper.toEntity(request);
        Ticket saved = ticketService.createTicket(ticket);
        fireTicketCreatedNotifications(saved);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // Create ticket with images (multipart)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> createTicketWithImages(
            @RequestPart("ticket") @Valid TicketRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images)
            throws IOException {

        if (images != null && images.size() > 3)
            throw new IllegalArgumentException("Maximum 3 images allowed");

        List<String> imageUrls = imageStorageService.saveImages(images);
        request.setImageUrls(imageUrls);

        Ticket ticket = ticketMapper.toEntity(request);
        Ticket saved = ticketService.createTicket(ticket);
        fireTicketCreatedNotifications(saved);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // GET all tickets (admin)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // GET tickets by user email — student sees only their own
    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(@RequestParam String email) {
        return ResponseEntity.ok(ticketService.getTicketsByUser(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(@PathVariable String id,
                                               @Valid @RequestBody TicketRequest request) {
        Ticket updatedTicket = ticketMapper.toEntity(request);
        return ResponseEntity.ok(ticketService.updateTicket(id, updatedTicket));
    }

    // Admin/Technician: update status workflow
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {

        TicketStatus status = TicketStatus.valueOf(payload.get("status"));
        String assignedTo      = payload.get("assignedTo");
        String assignedToEmail = payload.get("assignedToEmail");
        String resolutionNotes = payload.get("resolutionNotes");
        String rejectionReason = payload.get("rejectionReason");

        Ticket updated = ticketService.updateTicketStatus(
                id, status, assignedTo, assignedToEmail, resolutionNotes, rejectionReason);

        // Notify the ticket submitter about the status change
        if (updated.getUserEmail() != null && !updated.getUserEmail().isEmpty()) {
            String statusLabel = status.name();
            String title = "Ticket Status Updated: " + statusLabel;
            String message = "Your ticket \"" + updated.getResource() + "\" (" + updated.getCategory() + ") "
                    + "status has been changed to " + statusLabel + ".";
            if (resolutionNotes != null && !resolutionNotes.isEmpty()) {
                message += " Note: " + resolutionNotes;
            }
            if (rejectionReason != null && !rejectionReason.isEmpty()) {
                message += " Reason: " + rejectionReason;
            }
            notificationService.createUserNotification(updated.getUserEmail(), title, message, "/my-tickets");
        }

        // Notify the assigned technician when a ticket is assigned to them
        if (assignedToEmail != null && !assignedToEmail.isEmpty()) {
            String techTitle   = "Ticket Assigned to You";
            String techMessage = "Ticket \"" + updated.getResource() + "\" (" + updated.getCategory() + ") "
                    + "has been assigned to you. Status: " + status.name() + ".";
            notificationService.createUserNotification(assignedToEmail, techTitle, techMessage, "/technician-tickets");
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        commentService.deleteCommentsByTicket(id); // cleanup comments first
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /** Fires both admin and user notifications when a ticket is created. */
    private void fireTicketCreatedNotifications(Ticket ticket) {
        String userEmail = ticket.getUserEmail() != null ? ticket.getUserEmail() : "Unknown";
        String resource  = ticket.getResource()  != null ? ticket.getResource()  : "N/A";
        String location  = ticket.getLocation()  != null ? ticket.getLocation()  : "N/A";
        String category  = ticket.getCategory()  != null ? ticket.getCategory()  : "N/A";

        // 1. Admin notification
        String adminTitle   = "New Ticket Submitted";
        String adminMessage = "User: " + userEmail
                + " | Resource: " + resource
                + " | Category: " + category
                + " | Location: " + location;
        notificationService.createAdminNotification(adminTitle, adminMessage, "/ticketList", userEmail);

        // 2. User (submitter) notification
        String userTitle   = "Ticket Submitted Successfully";
        String userMessage = "Your ticket for \"" + resource + "\" (" + category + ") has been received and is now OPEN.";
        notificationService.createUserNotification(userEmail, userTitle, userMessage, "/my-tickets");
    }
}