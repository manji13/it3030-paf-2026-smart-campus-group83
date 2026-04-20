package com.smartcampushub.model.member4;

import com.smartcampushub.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String email;
    private String name;
    private String pictureUrl;
    private String provider;
    @Builder.Default
    private Set<UserRole> roles = new HashSet<>();
    @Builder.Default
    private boolean enabled = true;
    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant lastLoginAt;
}
