package com.smartcampushub.controller.member4;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.common.util.SecurityUtils;
import com.smartcampushub.dto.member4.AuthResponseMember4;
import com.smartcampushub.dto.member4.MockGoogleLoginRequestMember4;
import com.smartcampushub.dto.member4.UserResponseMember4;
import com.smartcampushub.service.member4.AuthServiceMember4;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthControllerMember4 {

    private final AuthServiceMember4 authServiceMember4;
    private final SecurityUtils securityUtils;

    @PostMapping({"/google/mock", "/mock-google-login"})
    public ResponseEntity<ApiResponse<AuthResponseMember4>> mockGoogleSignIn(
            @Valid @RequestBody MockGoogleLoginRequestMember4 request
    ) {
        AuthResponseMember4 auth = authServiceMember4.mockGoogleLogin(request);
        return ResponseEntity.ok(ApiResponse.ok("Mock Google sign-in successful", auth));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<UserResponseMember4>> me() {
        String userId = securityUtils.currentUserId();
        UserResponseMember4 profile = authServiceMember4.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok("Current user profile fetched", profile));
    }
}