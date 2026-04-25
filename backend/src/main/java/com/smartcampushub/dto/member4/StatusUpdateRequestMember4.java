package com.smartcampushub.dto.member4;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequestMember4 {
    @NotNull(message = "Active flag is required")
    private Boolean active;
}