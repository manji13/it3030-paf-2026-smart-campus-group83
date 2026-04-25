package com.smartcampushub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"com.smartcampushub", "com.sliit.smartcampus"})
@EnableMongoRepositories(basePackages = {"com.smartcampushub", "com.sliit.smartcampus"})
public class SmartCampusHubApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusHubApplication.class, args);
    }
}
