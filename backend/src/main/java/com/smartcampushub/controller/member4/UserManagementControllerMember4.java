package com.smartcampushub.controller.member4;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.dto.member4.RoleUpdateRequestMember4;
import com.smartcampushub.dto.member4.StatusUpdateRequestMember4;
import com.smartcampushub.dto.member4.UserResponseMember4;
import com.smartcampushub.service.member4.UserManagementServiceMember4;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserManagementControllerMember4 {

    private final UserManagementServiceMember4 userManagementServiceMember4;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponseMember4>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users fetched successfully", userManagementServiceMember4.getAllUsers()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseMember4>> getUser(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok("User fetched successfully", userManagementServiceMember4.getUserById(id)));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseMember4>> updateRole(
            @PathVariable String id,
            @Valid @RequestBody RoleUpdateRequestMember4 request
    ) {
        return ResponseEntity.ok(ApiResponse.ok("User role updated successfully", userManagementServiceMember4.updateRole(id, request)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseMember4>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateRequestMember4 request
    ) {
        return ResponseEntity.ok(ApiResponse.ok("User status updated successfully", userManagementServiceMember4.updateStatus(id, request)));
    }
}