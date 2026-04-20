package com.smartcampushub.model.member3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketComment {
    private String id;
    private String authorUserId;
    private String authorDisplayName;
    private String message;
    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
}
