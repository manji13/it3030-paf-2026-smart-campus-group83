package com.sliit.smartcampus.repository.member1;

import com.sliit.smartcampus.entity.member1.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {
}
