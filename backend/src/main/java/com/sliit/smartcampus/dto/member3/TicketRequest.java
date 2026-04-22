package com.sliit.smartcampus.dto.member3;



import com.sliit.smartcampus.enums.Priority;
import lombok.Data;

import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class TicketRequest {

    @NotBlank
    private String resource;

    @NotBlank
    private String location;

    @NotBlank
    private String category;

    @NotBlank
    private String description;

    @NotNull
    private Priority priority;

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$|^\\+?[0-9. ()-]{7,}$")
    private String contactDetails;

    @Size(max = 3)
    private List<String> imageUrls;
}
