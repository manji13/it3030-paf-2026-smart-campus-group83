package com.sliit.smartcampus.controller.member3;

import com.sliit.smartcampus.entity.member3.Comment;
import com.sliit.smartcampus.service.member3.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // GET all comments for a ticket
    @GetMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    // POST add a new comment
    @PostMapping("/api/tickets/{ticketId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> payload) {

        String authorEmail = payload.get("authorEmail");
        String authorName  = payload.get("authorName");
        String text        = payload.get("text");

        if (text == null || text.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Comment comment = commentService.addComment(ticketId, authorEmail, authorName, text);
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    // PUT edit a comment — owner only
    @PutMapping("/api/comments/{id}")
    public ResponseEntity<?> editComment(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            String requestEmail = payload.get("requestEmail");
            String newText      = payload.get("text");
            Comment updated = commentService.editComment(id, requestEmail, newText);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    // DELETE a comment — owner or admin
    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String id,
            @RequestParam String requestEmail,
            @RequestParam(defaultValue = "false") boolean isAdmin) {
        try {
            commentService.deleteComment(id, requestEmail, isAdmin);
            return ResponseEntity.ok("Comment deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}