package com.smartcampushub.dto.member1;

import com.smartcampushub.enums.ResourceStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class ResourceCreateRequestMember1 {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotEmpty(message = "At least one availability window is required")
    private List<String> availabilityWindows;

    @NotNull(message = "Status is required")
    private ResourceStatus status;

    private String description;
}
