package com.smartcampushub.repository.member4;

import com.smartcampushub.model.member4.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepositoryMember4 extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}