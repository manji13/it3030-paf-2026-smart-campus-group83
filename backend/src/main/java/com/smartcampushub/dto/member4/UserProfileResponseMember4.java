package com.smartcampushub.dto.member4;

import com.smartcampushub.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class UserProfileResponseMember4 {
    private String id;
    private String email;
    private String name;
    private String pictureUrl;
    private Set<UserRole> roles;
}
