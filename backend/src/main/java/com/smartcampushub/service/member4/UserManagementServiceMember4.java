package com.smartcampushub.service.member4;

import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member4.RoleUpdateRequestMember4;
import com.smartcampushub.dto.member4.StatusUpdateRequestMember4;
import com.smartcampushub.dto.member4.UserResponseMember4;
import com.smartcampushub.model.member4.User;
import com.smartcampushub.repository.member4.UserRepositoryMember4;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserManagementServiceMember4 {

    private final UserRepositoryMember4 userRepositoryMember4;

    public List<UserResponseMember4> getAllUsers() {
        return userRepositoryMember4.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public UserResponseMember4 getUserById(String id) {
        return toResponse(findUser(id));
    }

    public UserResponseMember4 updateRole(String id, RoleUpdateRequestMember4 request) {
        User user = findUser(id);
        user.setRole(request.getRole());
        user.setUpdatedAt(Instant.now());
        return toResponse(userRepositoryMember4.save(user));
    }

    public UserResponseMember4 updateStatus(String id, StatusUpdateRequestMember4 request) {
        User user = findUser(id);
        user.setActive(Boolean.TRUE.equals(request.getActive()));
        user.setUpdatedAt(Instant.now());
        return toResponse(userRepositoryMember4.save(user));
    }

    private User findUser(String id) {
        return userRepositoryMember4.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
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
}