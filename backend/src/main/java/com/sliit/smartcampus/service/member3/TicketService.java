package com.sliit.smartcampus.service.member3;

import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.enums.TicketStatus;
import com.sliit.smartcampus.repository.member3.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    // 🔐 Only this user's tickets
    public List<Ticket> getTicketsByUser(String userEmail) {
        return ticketRepository.findByUserEmail(userEmail);
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Ticket updateTicket(String id, Ticket updatedTicket) {
        return ticketRepository.findById(id).map(existing -> {
            existing.setResource(updatedTicket.getResource());
            existing.setLocation(updatedTicket.getLocation());
            existing.setCategory(updatedTicket.getCategory());
            existing.setDescription(updatedTicket.getDescription());
            existing.setPriority(updatedTicket.getPriority());
            existing.setContactDetails(updatedTicket.getContactDetails());
            existing.setImageUrls(updatedTicket.getImageUrls());
            existing.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    // 🔄 Admin/Technician: update status, assign, add notes
    public Ticket updateTicketStatus(String id, TicketStatus status,
                                     String assignedTo, String resolutionNotes,
                                     String rejectionReason) {
        return ticketRepository.findById(id).map(existing -> {
            existing.setStatus(status);
            if (assignedTo != null) existing.setAssignedTo(assignedTo);
            if (resolutionNotes != null) existing.setResolutionNotes(resolutionNotes);
            if (rejectionReason != null) existing.setRejectionReason(rejectionReason);
            existing.setUpdatedAt(LocalDateTime.now());
            return ticketRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Ticket not found: " + id));
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}