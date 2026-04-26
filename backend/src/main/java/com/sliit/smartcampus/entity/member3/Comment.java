package com.sliit.smartcampus.entity.member3;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String ticketId;       // which ticket this comment belongs to

    private String authorEmail;    // email of comment creator

    private String authorName;     // display name of comment creator

    private String text;           // comment content

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    private boolean edited = false; // shows "(edited)" label on frontend
}