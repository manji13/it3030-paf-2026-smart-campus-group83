package com.smartcampushub.repository.member2;

import com.smartcampushub.enums.BookingStatus;
import com.smartcampushub.model.member2.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepositoryMember2 extends MongoRepository<Booking, String> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, LocalDate date, Collection<BookingStatus> statuses);

    List<Booking> findAllByOrderByCreatedAtDesc();
}
