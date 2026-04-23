package com.sliit.smartcampus.repository.member3;

import com.sliit.smartcampus.entity.member3.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByTicketIdOrderByCreatedAtAsc(String ticketId);
    void deleteByTicketId(String ticketId); // cleanup when ticket deleted
}