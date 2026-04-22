package com.sliit.smartcampus.controller.member3;



import com.sliit.smartcampus.dto.member3.TicketRequest;
import com.sliit.smartcampus.dto.member3.TicketMapper;
import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.service.member3.TicketService;
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

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    @GetMapping("/test")
    public String test() {
        return "WORKING";
    }

    private final TicketService ticketService;
    private final TicketMapper ticketMapper;
    private final ImageStorageService imageStorageService;

    // Existing JSON endpoint (for backward compatibility or non-file uploads)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody TicketRequest request) {
        Ticket ticket = ticketMapper.toEntity(request);
        Ticket saved = ticketService.createTicket(ticket);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    // NEW endpoint for file upload (multipart/form-data)
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<Ticket> createTicketWithImages(
        @RequestPart("ticket") @Valid TicketRequest request,
        @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {

    // Validate max 3 images
    if (images != null && images.size() > 3) {
        throw new IllegalArgumentException("Maximum 3 images allowed");
    }

    // Save images if any
    List<String> imageUrls = imageStorageService.saveImages(images);
    request.setImageUrls(imageUrls);  // Set the URLs into the DTO

    Ticket ticket = ticketMapper.toEntity(request);
    Ticket saved = ticketService.createTicket(ticket);
    return new ResponseEntity<>(saved, HttpStatus.CREATED);
}

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
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
        Ticket saved = ticketService.updateTicket(id, updatedTicket);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}