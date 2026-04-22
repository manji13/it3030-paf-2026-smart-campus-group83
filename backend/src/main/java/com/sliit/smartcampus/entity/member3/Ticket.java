package com.sliit.smartcampus.entity.member3;


import com.sliit.smartcampus.enums.Priority;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.*;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    @NotBlank(message = "Resource is required")
    private String resource;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotBlank(message = "Contact details (email or phone) are required")
    @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$|^\\+?[0-9. ()-]{7,}$",
             message = "Contact must be a valid email or phone number")
    private String contactDetails;

    @Size(max = 3, message = "You can upload at most 3 images")
    private List<String> imageUrls;   // store URLs or Base64 strings; for simplicity we use URLs
}

