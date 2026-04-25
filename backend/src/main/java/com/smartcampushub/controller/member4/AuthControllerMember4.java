package com.smartcampushub.controller.member4;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.common.util.SecurityUtils;
import com.smartcampushub.dto.member4.AuthResponseMember4;
import com.smartcampushub.dto.member4.MockGoogleLoginRequestMember4;
import com.smartcampushub.dto.member4.UserProfileResponseMember4;
import com.smartcampushub.service.member4.AuthServiceMember4;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthControllerMember4 {

    private final AuthServiceMember4 authServiceMember4;
    private final SecurityUtils securityUtils;

    @PostMapping("/google/mock")
    public ResponseEntity<ApiResponse<AuthResponseMember4>> mockGoogleSignIn(
            @Valid @RequestBody MockGoogleLoginRequestMember4 request) {
        AuthResponseMember4 auth = authServiceMember4.mockGoogleLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Mock Google sign-in successful", auth));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<UserProfileResponseMember4>> me() {
        String userId = securityUtils.currentUserId();
        UserProfileResponseMember4 profile = authServiceMember4.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok("Current user profile fetched", profile));
    }

    // ── User Management (Admin only) ──────────────────────────────────────

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserProfileResponseMember4>>> getAllUsers() {
        List<UserProfileResponseMember4> users = authServiceMember4.getAllUsers();
        return ResponseEntity.ok(ApiResponse.ok("Users fetched successfully", users));
    }

    @PatchMapping("/users/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserProfileResponseMember4>> changeUserRole(
            @PathVariable String userId,
            @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        UserProfileResponseMember4 updated = authServiceMember4.changeUserRole(userId, newRole);
        return ResponseEntity.ok(ApiResponse.ok("User role updated successfully", updated));
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String userId) {
        authServiceMember4.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully", null));
    }

    @GetMapping("/users/technicians")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserProfileResponseMember4>>> getTechnicians() {
        List<UserProfileResponseMember4> techs = authServiceMember4.getTechnicians();
        return ResponseEntity.ok(ApiResponse.ok("Technicians fetched successfully", techs));
    }
}