package com.smartcampushub.dto.member1;

import com.smartcampushub.enums.ResourceStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ResourceResponseMember1 {
    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    private List<String> availabilityWindows;
    private ResourceStatus status;
    private String description;
    private Instant createdAt;
    private Instant updatedAt;
}
