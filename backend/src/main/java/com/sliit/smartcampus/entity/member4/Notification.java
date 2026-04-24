package com.sliit.smartcampus.entity.member4;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String title;       // e.g., "New Ticket Added"
    private String message;     // e.g., "Resource: Projector - Location: Hall A"
    private String targetPath;  // e.g., "/ticketList" (Where to navigate on click)
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
}