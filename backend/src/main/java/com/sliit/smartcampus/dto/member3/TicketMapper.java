package com.sliit.smartcampus.dto.member3;




import com.sliit.smartcampus.entity.member3.Ticket;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {

    public Ticket toEntity(TicketRequest request) {
        Ticket ticket = new Ticket();
        ticket.setResource(request.getResource());
        ticket.setLocation(request.getLocation());
        ticket.setCategory(request.getCategory());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setContactDetails(request.getContactDetails());
        ticket.setImageUrls(request.getImageUrls());
        return ticket;
    }

    public TicketRequest toDto(Ticket ticket) {
        TicketRequest dto = new TicketRequest();
        dto.setResource(ticket.getResource());
        dto.setLocation(ticket.getLocation());
        dto.setCategory(ticket.getCategory());
        dto.setDescription(ticket.getDescription());
        dto.setPriority(ticket.getPriority());
        dto.setContactDetails(ticket.getContactDetails());
        dto.setImageUrls(ticket.getImageUrls());
        return dto;
    }
}
