package com.sliit.smartcampus.controller.member3;

import com.sliit.smartcampus.dto.member3.TicketRequest;
import com.sliit.smartcampus.dto.member3.TicketMapper;
import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.enums.TicketStatus;
import com.sliit.smartcampus.service.member3.TicketService;
import com.sliit.smartcampus.service.member3.CommentService;
import com.sliit.smartcampus.service.member3.ImageStorageService;
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

    @GetMapping("/test")
    public String test() { return "WORKING"; }

    // Create ticket (JSON)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest request) {
        Ticket ticket = ticketMapper.toEntity(request);
        return new ResponseEntity<>(ticketService.createTicket(ticket), HttpStatus.CREATED);
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
        return new ResponseEntity<>(ticketService.createTicket(ticket), HttpStatus.CREATED);
    }

    // GET all tickets (admin)
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // 🔐 GET tickets by user email — student sees only their own
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

    // 🔄 Admin/Technician: update status workflow
    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {

        TicketStatus status = TicketStatus.valueOf(payload.get("status"));
        String assignedTo = payload.get("assignedTo");
        String resolutionNotes = payload.get("resolutionNotes");
        String rejectionReason = payload.get("rejectionReason");

        return ResponseEntity.ok(
            ticketService.updateTicketStatus(id, status, assignedTo, resolutionNotes, rejectionReason)
        );
    }

   @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
    commentService.deleteCommentsByTicket(id); // cleanup comments first
    ticketService.deleteTicket(id);
    return ResponseEntity.noContent().build();
}
}