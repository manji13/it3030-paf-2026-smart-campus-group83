package com.sliit.smartcampus.repository.member3;



import com.sliit.smartcampus.entity.member3.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
}
