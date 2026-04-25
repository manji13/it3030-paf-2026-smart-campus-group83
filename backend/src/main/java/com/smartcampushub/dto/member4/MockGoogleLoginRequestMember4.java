package com.smartcampushub.dto.member4;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MockGoogleLoginRequestMember4 {
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Name is required")
    private String fullName;

    private String profileImageUrl;
}
