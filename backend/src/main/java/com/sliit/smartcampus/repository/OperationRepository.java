// src/main/java/com/sliit/smartcampus/repository/OperationRepository.java
package com.sliit.smartcampus.repository;

import com.sliit.smartcampus.entity.Operation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperationRepository extends MongoRepository<Operation, String> {
    // Custom query methods can go here if needed later
}