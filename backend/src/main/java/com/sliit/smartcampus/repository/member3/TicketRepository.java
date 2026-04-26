package com.sliit.smartcampus.repository.member3;

import com.sliit.smartcampus.entity.member3.Ticket;
import com.sliit.smartcampus.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    // Get all tickets for a specific user
    List<Ticket> findByUserEmail(String userEmail);

    // Get tickets by status (for admin)
    List<Ticket> findByStatus(TicketStatus status);

    // Get tickets by user + status
    List<Ticket> findByUserEmailAndStatus(String userEmail, TicketStatus status);
}