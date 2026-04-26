package com.sliit.smartcampus.repository.member4;

import com.sliit.smartcampus.entity.member4.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    // All notifications (legacy / admin)
    List<Notification> findAllByOrderByCreatedAtDesc();
    long countByIsReadFalse();

    // Admin-only notifications (recipientEmail is null)
    List<Notification> findByRecipientEmailIsNullOrderByCreatedAtDesc();
    long countByRecipientEmailIsNullAndIsReadFalse();

    // User-specific notifications
    List<Notification> findByRecipientEmailOrderByCreatedAtDesc(String recipientEmail);
    long countByRecipientEmailAndIsReadFalse(String recipientEmail);
}