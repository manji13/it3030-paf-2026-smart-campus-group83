package com.sliit.smartcampus.repository.member2;

import com.sliit.smartcampus.entity.member2.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByResourceIdAndDateAndStatusIn(String resourceId, LocalDate date, List<String> statuses);
}
