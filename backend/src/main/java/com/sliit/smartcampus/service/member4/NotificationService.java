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

    // Call this method whenever a new user registers or a ticket is created
    public Notification createNotification(String title, String message, String targetPath) {
        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setTargetPath(targetPath);
        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc();
    }

    public long getUnreadCount() {
        return notificationRepository.countByIsReadFalse();
    }

    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead() {
        List<Notification> unread = notificationRepository.findAll();
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}