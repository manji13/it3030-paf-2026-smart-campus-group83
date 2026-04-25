package com.smartcampushub.service.member4;

import com.smartcampushub.common.exception.BusinessException;
import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member4.AuthResponseMember4;
import com.smartcampushub.dto.member4.MockGoogleLoginRequestMember4;
import com.smartcampushub.dto.member4.UserResponseMember4;
import com.smartcampushub.enums.UserRole;
import com.smartcampushub.model.member4.User;
import com.smartcampushub.repository.member4.UserRepositoryMember4;
import com.smartcampushub.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthServiceMember4 {

    private final UserRepositoryMember4 userRepositoryMember4;
    private final JwtService jwtService;

    public AuthResponseMember4 mockGoogleLogin(MockGoogleLoginRequestMember4 request) {
        User user = loadOrCreateUser(request.getEmail(), request.getFullName(), request.getProfileImageUrl());
        return createSessionResponse(user);
    }

    public AuthResponseMember4 processOauth2Login(String email, String fullName, String profileImageUrl) {
        User user = loadOrCreateUser(email, fullName, profileImageUrl);
        return createSessionResponse(user);
    }

    public UserResponseMember4 getProfile(String userId) {
        User user = userRepositoryMember4.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toResponse(user);
    }

    private User loadOrCreateUser(String email, String fullName, String profileImageUrl) {
        String normalizedEmail = email.toLowerCase();
        User user = userRepositoryMember4.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> createNewUser(normalizedEmail, fullName, profileImageUrl));

        if (!user.isActive()) {
            throw new BusinessException("This account has been disabled by an administrator");
        }

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl.trim());
        }

        user.setUpdatedAt(Instant.now());
        return userRepositoryMember4.save(user);
    }

    private User createNewUser(String email, String fullName, String profileImageUrl) {
        return User.builder()
                .email(email)
                .fullName(fullName == null ? email : fullName.trim())
                .profileImageUrl(profileImageUrl == null ? "" : profileImageUrl.trim())
                .role(UserRole.USER)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    private AuthResponseMember4 createSessionResponse(User user) {
        String token = jwtService.generateToken(user);
        return AuthResponseMember4.builder()
                .token(token)
                .user(toResponse(user))
                .build();
    }

    private UserResponseMember4 toResponse(User user) {
        return UserResponseMember4.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public UserResponseMember4 updateUserProfile(String userId, String fullName, String profileImageUrl) {
        User user = userRepositoryMember4.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (profileImageUrl != null) {
            user.setProfileImageUrl(profileImageUrl.trim());
        }

        user.setUpdatedAt(Instant.now());
        return toResponse(userRepositoryMember4.save(user));
    }

    public UserResponseMember4 getProfileByEmail(String email) {
        User user = userRepositoryMember4.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user);
    }

    private AuthResponseMember4 toAuthResponse(User user, String token) {
        return AuthResponseMember4.builder()
                .token(token)
                .user(toResponse(user))
                .build();
    }
}