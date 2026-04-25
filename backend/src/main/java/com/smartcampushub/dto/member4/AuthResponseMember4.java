package com.smartcampushub.dto.member4;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseMember4 {
    private String token;
    private UserResponseMember4 user;
}
