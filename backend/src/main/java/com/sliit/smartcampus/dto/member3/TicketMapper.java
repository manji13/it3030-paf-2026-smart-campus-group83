package com.sliit.smartcampus.dto.member3;

import com.sliit.smartcampus.entity.member3.Ticket;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TicketMapper {

    public Ticket toEntity(TicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setUserEmail(request.getUserEmail());
        ticket.setResource(request.getResource());
        ticket.setLocation(request.getLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setContactDetails(request.getContactDetails());
        ticket.setImageUrls(request.getImageUrls());

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        }
        ticket.setAssignedTo(request.getAssignedTo());
        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.setRejectionReason(request.getRejectionReason());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticket;
    }
}