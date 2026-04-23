package com.sliit.smartcampus.service.member3;

import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.repository.member3.TicketRepository;
import com.sliit.smartcampus.service.member4.NotificationService; // Import Member 4's service
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    
    // Inject the NotificationService here
    private final NotificationService notificationService;

    public Ticket createTicket(Ticket ticket) {
        // 1. Save the ticket first to ensure it's successfully created
        Ticket savedTicket = ticketRepository.save(ticket);
        
        // 2. Trigger the notification (Member 4's logic)
        try {
            String title = "New Ticket: " + savedTicket.getResource();
            String message = "Priority: " + savedTicket.getPriority() + " | Location: " + savedTicket.getLocation();
            String targetPath = "/ticketList"; // Directs admin to the Ticket View List
            
            notificationService.createNotification(title, message, targetPath);
        } catch (Exception e) {
            // Log error so a notification failure doesn't break the ticket creation
            System.err.println("Failed to create notification for ticket: " + e.getMessage());
        }

        // 3. Return the saved ticket
        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Ticket updateTicket(String id, Ticket updatedTicket) {
        updatedTicket.setId(id);
        return ticketRepository.save(updatedTicket);
    }

    public void deleteTicket(String id) {
        ticketRepository.deleteById(id);
    }
}