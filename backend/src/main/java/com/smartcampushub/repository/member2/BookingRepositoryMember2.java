package com.smartcampushub.repository.member2;

import com.smartcampushub.enums.BookingStatus;
import com.smartcampushub.model.member2.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

import org.springframework.data.mongodb.repository.Query;

@Repository
public interface BookingRepositoryMember2 extends MongoRepository<Booking, String> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(String userId);

    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, LocalDate date, Collection<BookingStatus> statuses);

    List<Booking> findAllByOrderByCreatedAtDesc();

    @Query(value = "{ 'resourceId': ?0, 'date': ?1, 'status': { $in: ['PENDING', 'APPROVED'] }, '$and': [ { 'startTime': { $lt: ?3 } }, { 'endTime': { $gt: ?2 } } ] }", count = true)
    long countConflictingBookings(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
