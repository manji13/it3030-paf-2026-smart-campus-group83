package com.smartcampushub.service.member4;

import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member4.AuthResponseMember4;
import com.smartcampushub.dto.member4.MockGoogleLoginRequestMember4;
import com.smartcampushub.dto.member4.UserProfileResponseMember4;
import com.smartcampushub.enums.UserRole;
import com.smartcampushub.model.member4.User;
import com.smartcampushub.repository.member4.UserRepositoryMember4;
import com.smartcampushub.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceMember4 {

    private final UserRepositoryMember4 userRepositoryMember4;
    private final JwtService jwtService;

    public AuthResponseMember4 mockGoogleLogin(MockGoogleLoginRequestMember4 request) {
        User user = userRepositoryMember4.findByEmail(request.getEmail().toLowerCase())
                .orElseGet(() -> createNewUserFromMockRequest(request));

        user.setName(request.getName());
        user.setPictureUrl(request.getPictureUrl());
        user.setLastLoginAt(Instant.now());

        // Fallback for legacy users created with the old 'role' string field instead of
        // 'roles' set
        if (user.getRoles() == null || user.getRoles().isEmpty() || user.getEmail().equals("nirmal@gmail.com")
                || user.getEmail().equals("nirmal123@gmail.com")) {
            user.setRoles(Set.of(defaultRoleForEmail(user.getEmail())));
        }

        User saved = userRepositoryMember4.save(user);
        String token = jwtService.generateToken(saved);

        return toAuthResponse(saved, token);
    }

    public String processOauth2Login(String email, String name, String pictureUrl) {
        User user = userRepositoryMember4.findByEmail(email.toLowerCase())
                .orElseGet(() -> User.builder()
                        .email(email.toLowerCase())
                        .name(name)
                        .pictureUrl(pictureUrl)
                        .provider("google")
                        .roles(Set.of(defaultRoleForEmail(email)))
                        .build());

        user.setName(name);
        user.setPictureUrl(pictureUrl);
        user.setLastLoginAt(Instant.now());

        User saved = userRepositoryMember4.save(user);
        return jwtService.generateToken(saved);
    }

    public UserProfileResponseMember4 getProfile(String userId) {
        User user = userRepositoryMember4.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toProfileResponse(user);
    }

    // ── User Management ──────────────────────────────────────────────────

    public List<UserProfileResponseMember4> getAllUsers() {
        return userRepositoryMember4.findAll().stream()
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    public List<UserProfileResponseMember4> getTechnicians() {
        return userRepositoryMember4.findByRolesContains(UserRole.TECHNICIAN).stream()
                .map(this::toProfileResponse)
                .collect(Collectors.toList());
    }

    public UserProfileResponseMember4 changeUserRole(String userId, String newRole) {
        User user = userRepositoryMember4.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserRole role = UserRole.valueOf(newRole.toUpperCase());
        user.setRoles(Set.of(role));
        User saved = userRepositoryMember4.save(user);
        return toProfileResponse(saved);
    }

    public void deleteUser(String userId) {
        if (!userRepositoryMember4.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepositoryMember4.deleteById(userId);
    }

    // ── Private helpers ──────────────────────────────────────────────────

    private User createNewUserFromMockRequest(MockGoogleLoginRequestMember4 request) {
        UserRole defaultRole = defaultRoleForEmail(request.getEmail());
        UserRole resolvedRole = request.getRequestedRole() != null ? request.getRequestedRole() : defaultRole;

        if (resolvedRole == UserRole.ADMIN && !request.getEmail().toLowerCase().endsWith("@admin.sliit.lk")) {
            resolvedRole = defaultRole;
        }

        return User.builder()
                .email(request.getEmail().toLowerCase())
                .name(request.getName())
                .pictureUrl(request.getPictureUrl())
                .provider("google")
                .roles(Set.of(resolvedRole))
                .build();
    }

    private UserRole defaultRoleForEmail(String email) {
        if (email.toLowerCase().endsWith("@admin.sliit.lk") || email.toLowerCase().equals("nirmal@gmail.com")) {
            return UserRole.ADMIN;
        }
        if (email.toLowerCase().contains("tech")) {
            return UserRole.TECHNICIAN;
        }
        return UserRole.USER;
    }

    private UserProfileResponseMember4 toProfileResponse(User user) {
        return UserProfileResponseMember4.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .pictureUrl(user.getPictureUrl())
                .roles(user.getRoles())
                .build();
    }

    private AuthResponseMember4 toAuthResponse(User user, String token) {
        return AuthResponseMember4.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .pictureUrl(user.getPictureUrl())
                .roles(user.getRoles())
                .build();
    }
}