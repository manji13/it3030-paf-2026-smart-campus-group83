package com.smartcampushub.service.member4;

import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member4.NotificationResponseMember4;
import com.smartcampushub.enums.NotificationType;
import com.smartcampushub.model.member4.Notification;
import com.smartcampushub.repository.member4.NotificationRepositoryMember4;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceMember4 {

    private final NotificationRepositoryMember4 notificationRepositoryMember4;

    public void createNotification(String recipientUserId, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .recipientUserId(recipientUserId)
                .title(title)
                .message(message)
                .type(type)
                .build();
        notificationRepositoryMember4.save(notification);
    }

    public List<NotificationResponseMember4> getMyNotifications(String userId) {
        return notificationRepositoryMember4.findByRecipientUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public NotificationResponseMember4 markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepositoryMember4.findByIdAndRecipientUserId(notificationId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        notification.setRead(true);
        return mapToResponse(notificationRepositoryMember4.save(notification));
    }

    public long markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepositoryMember4.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepositoryMember4.saveAll(notifications);
        return notifications.size();
    }

    public long getUnreadCount(String userId) {
        return notificationRepositoryMember4.countByRecipientUserIdAndIsReadFalse(userId);
    }

    private NotificationResponseMember4 mapToResponse(Notification notification) {
        return NotificationResponseMember4.builder()
                .id(notification.getId())
                .recipientUserId(notification.getRecipientUserId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
