package com.smartcampushub.model.member3;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketAttachment {
    private String fileName;
    private String fileUrl;
    private String contentType;
}
