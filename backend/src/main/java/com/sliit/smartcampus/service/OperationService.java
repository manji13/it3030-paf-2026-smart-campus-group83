// src/main/java/com/sliit/smartcampus/service/OperationService.java
package com.sliit.smartcampus.service;

import com.sliit.smartcampus.entity.Operation;
import com.sliit.smartcampus.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OperationService {

    @Autowired
    private OperationRepository repository;

    public List<Operation> getAllOperations() {
        return repository.findAll();
    }

    public Operation createOperation(Operation operation) {
        return repository.save(operation);
    }
}