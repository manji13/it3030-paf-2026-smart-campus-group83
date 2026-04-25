package com.smartcampushub.model.member4;

import com.smartcampushub.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
@CompoundIndexes({
        @CompoundIndex(name = "recipient_read_idx", def = "{'recipientUserId': 1, 'isRead': 1}")
})
public class Notification {
    @Id
    private String id;
    private String recipientUserId;
    private String title;
    private String message;
    private NotificationType type;
    private String targetPath;
    @Builder.Default
    private boolean isRead = false;
    @Builder.Default
    private Instant createdAt = Instant.now();
}