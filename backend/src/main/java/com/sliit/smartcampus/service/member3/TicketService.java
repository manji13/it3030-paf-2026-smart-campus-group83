package com.sliit.smartcampus.service.member3;



import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.repository.member3.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
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

