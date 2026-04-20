package com.smartcampushub.repository.member3;

import com.smartcampushub.model.member3.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepositoryMember3 extends MongoRepository<Ticket, String> {
}
