// src/main/java/com/sliit/smartcampus/controller/OperationController.java
package com.sliit.smartcampus.controller;

import com.sliit.smartcampus.entity.Operation;
import com.sliit.smartcampus.service.OperationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
public class OperationController {

    @Autowired
    private OperationService service;

    @GetMapping
    public List<Operation> getOperations() {
        return service.getAllOperations();
    }

    @PostMapping
    public Operation addOperation(@RequestBody Operation operation) {
        return service.createOperation(operation);
    }
}