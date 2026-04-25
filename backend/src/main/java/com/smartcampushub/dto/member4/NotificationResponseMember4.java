package com.smartcampushub.dto.member4;

import com.smartcampushub.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class NotificationResponseMember4 {
    private String id;
    private String recipientUserId;
    private String title;
    private String message;
    private NotificationType type;
    private String targetPath;
    private boolean isRead;
    private Instant createdAt;
}
