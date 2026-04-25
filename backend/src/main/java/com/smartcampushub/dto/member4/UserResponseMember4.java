package com.smartcampushub.dto.member4;

import com.smartcampushub.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserResponseMember4 {
    private String id;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private UserRole role;
    private boolean active;
    private Instant createdAt;
    private Instant updatedAt;
}