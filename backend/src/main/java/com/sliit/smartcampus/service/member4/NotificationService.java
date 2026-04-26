package com.sliit.smartcampus.service.member4;

import com.sliit.smartcampus.entity.member4.Notification;
import com.sliit.smartcampus.repository.member4.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // ── Admin notifications (recipientEmail = null) ──────────────────────────

    /** Create an admin-only notification (shown in admin /notifications panel). */
    public Notification createAdminNotification(String title, String message, String targetPath, String userName) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetPath(targetPath);
        notification.setUserName(userName);
        notification.setRecipientEmail(null); // null = admin notification
        return notificationRepository.save(notification);
    }

    /** Legacy helper kept for backward compatibility. */
    public Notification createNotification(String title, String message, String targetPath) {
        return createAdminNotification(title, message, targetPath, null);
    }

    /** Returns all admin-level notifications (recipientEmail is null). */
    public List<Notification> getAllNotifications() {
        return notificationRepository.findByRecipientEmailIsNullOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return notificationRepository.countByRecipientEmailIsNullAndIsReadFalse();
    }

    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findByRecipientEmailIsNullOrderByCreatedAtDesc();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ── User-specific notifications ──────────────────────────────────────────

    /** Create a notification for a specific user (shown in user /user-notifications panel). */
    public Notification createUserNotification(String recipientEmail, String title, String message, String targetPath) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetPath(targetPath);
        notification.setRecipientEmail(recipientEmail);
        return notificationRepository.save(notification);
    }

    /** Returns all notifications for a given user email. */
    public List<Notification> getNotificationsForUser(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public long getUnreadCountForUser(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    public void markAllAsReadForUser(String email) {
        List<Notification> unread = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}