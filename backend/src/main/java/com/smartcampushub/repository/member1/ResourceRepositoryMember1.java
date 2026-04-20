package com.smartcampushub.repository.member1;

import com.smartcampushub.model.member1.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepositoryMember1 extends MongoRepository<Resource, String> {
}
