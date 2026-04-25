package com.smartcampushub.dto.member4;

import com.smartcampushub.enums.UserRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleUpdateRequestMember4 {
    @NotNull(message = "Role is required")
    private UserRole role;
}