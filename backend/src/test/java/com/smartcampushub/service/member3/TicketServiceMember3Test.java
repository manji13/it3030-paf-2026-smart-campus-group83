package com.smartcampushub.service.member3;

import com.smartcampushub.common.exception.ForbiddenOperationException;
import com.smartcampushub.dto.member3.TicketCommentUpdateRequestMember3;
import com.smartcampushub.model.member3.Ticket;
import com.smartcampushub.model.member3.TicketComment;
import com.smartcampushub.repository.member3.TicketRepositoryMember3;
import com.smartcampushub.repository.member4.UserRepositoryMember4;
import com.smartcampushub.service.member4.NotificationServiceMember4;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TicketServiceMember3Test {

    @Mock
    private TicketRepositoryMember3 ticketRepositoryMember3;

    @Mock
    private NotificationServiceMember4 notificationServiceMember4;

    @Mock
    private UserRepositoryMember4 userRepositoryMember4;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private TicketServiceMember3 ticketServiceMember3;

    @Test
    void updateComment_shouldFail_whenNonOwnerTriesToEdit() {
        TicketComment comment = TicketComment.builder()
                .id("comment-1")
                .authorUserId("owner-user")
                .message("Initial message")
                .build();

        Ticket ticket = Ticket.builder()
                .id("ticket-1")
                .comments(new ArrayList<>())
                .build();
        ticket.getComments().add(comment);

        when(ticketRepositoryMember3.findById("ticket-1")).thenReturn(Optional.of(ticket));

        TicketCommentUpdateRequestMember3 request = new TicketCommentUpdateRequestMember3();
        request.setMessage("Updated message");

        assertThrows(
                ForbiddenOperationException.class,
                () -> ticketServiceMember3.updateComment("ticket-1", "comment-1", "other-user", false, request)
        );
    }
}