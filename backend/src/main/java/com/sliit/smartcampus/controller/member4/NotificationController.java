package com.sliit.smartcampus.controller.member4;

import com.sliit.smartcampus.entity.member4.Notification;
import com.sliit.smartcampus.service.member4.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    private final NotificationService notificationService;

    // ── Admin notifications ──────────────────────────────────────────────────

    /** GET /api/notifications — returns admin-level notifications (recipientEmail = null) */
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationService.getAllNotifications());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(notificationService.getUnreadCount());
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok().build();
    }

    // ── User-specific notifications ──────────────────────────────────────────

    /** GET /api/notifications/user?email=xxx — returns notifications for that user */
    @GetMapping("/user")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(email));
    }

    /** GET /api/notifications/user/unread-count?email=xxx */
    @GetMapping("/user/unread-count")
    public ResponseEntity<Long> getUserUnreadCount(@RequestParam String email) {
        return ResponseEntity.ok(notificationService.getUnreadCountForUser(email));
    }

    /** PUT /api/notifications/user/read-all?email=xxx */
    @PutMapping("/user/read-all")
    public ResponseEntity<Void> markAllAsReadForUser(@RequestParam String email) {
        notificationService.markAllAsReadForUser(email);
        return ResponseEntity.ok().build();
    }
}