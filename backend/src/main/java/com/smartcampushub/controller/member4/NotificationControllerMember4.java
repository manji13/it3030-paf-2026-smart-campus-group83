package com.smartcampushub.controller.member4;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.common.util.SecurityUtils;
import com.smartcampushub.dto.member4.NotificationResponseMember4;
import com.smartcampushub.service.member4.NotificationServiceMember4;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/member4/notifications")
@RequiredArgsConstructor
public class NotificationControllerMember4 {

    private final NotificationServiceMember4 notificationServiceMember4;
    private final SecurityUtils securityUtils;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<NotificationResponseMember4>>> getMyNotifications() {
        String userId = securityUtils.currentUserId();
        return ResponseEntity.ok(ApiResponse.ok("Notifications fetched successfully", notificationServiceMember4.getMyNotifications(userId)));
    }

    @PatchMapping("/{notificationId}/read")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<NotificationResponseMember4>> markAsRead(@PathVariable String notificationId) {
        String userId = securityUtils.currentUserId();
        NotificationResponseMember4 response = notificationServiceMember4.markAsRead(notificationId, userId);
        return ResponseEntity.ok(ApiResponse.ok("Notification marked as read", response));
    }

    @PatchMapping("/me/read-all")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> markAllAsRead() {
        String userId = securityUtils.currentUserId();
        long count = notificationServiceMember4.markAllAsRead(userId);
        return ResponseEntity.ok(ApiResponse.ok("All notifications marked as read", Map.of("updatedCount", count)));
    }

    @GetMapping("/me/unread-count")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount() {
        String userId = securityUtils.currentUserId();
        long count = notificationServiceMember4.getUnreadCount(userId);
        return ResponseEntity.ok(ApiResponse.ok("Unread count fetched", Map.of("unreadCount", count)));
    }
}
