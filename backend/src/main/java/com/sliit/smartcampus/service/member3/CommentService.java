package com.sliit.smartcampus.service.member3;

import com.sliit.smartcampus.entity.member3.Comment;
import com.sliit.smartcampus.repository.member3.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    // Get all comments for a ticket
    public List<Comment> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    // Add a new comment
    public Comment addComment(String ticketId, String authorEmail,
                               String authorName, String text) {
        Comment comment = new Comment();
        comment.setTicketId(ticketId);
        comment.setAuthorEmail(authorEmail);
        comment.setAuthorName(authorName);
        comment.setText(text);
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Edit comment — only owner can edit
    public Comment editComment(String commentId, String requestEmail, String newText) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthorEmail().equals(requestEmail)) {
            throw new RuntimeException("You can only edit your own comments");
        }

        comment.setText(newText);
        comment.setEdited(true);
        comment.setUpdatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    // Delete comment — owner or admin can delete
    public void deleteComment(String commentId, String requestEmail, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        boolean isOwner = comment.getAuthorEmail().equals(requestEmail);

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not allowed to delete this comment");
        }

        commentRepository.deleteById(commentId);
    }

    // Cleanup all comments when ticket is deleted
    public void deleteCommentsByTicket(String ticketId) {
        commentRepository.deleteByTicketId(ticketId);
    }
}