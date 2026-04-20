package com.sliit.smartcampus.service.member1;

import com.sliit.smartcampus.entity.member1.Facility;
import com.sliit.smartcampus.repository.member1.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository repository;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Facility saveFacility(Facility facility) {
        return repository.save(facility);
    }

    public Optional<Facility> getFacilityById(String id) {
        return repository.findById(id);
    }

    public List<Facility> getAllFacilities() {
        return repository.findAll();
    }

    public void deleteFacility(String id) {
        repository.deleteById(id);
    }

    public List<Facility> searchFacilities(String name, String type, Integer minCapacity, String location) {
        Query query = new Query();

        if (name != null && !name.trim().isEmpty()) {
            query.addCriteria(Criteria.where("name").regex(name, "i"));
        }
        if (type != null && !type.trim().isEmpty()) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (minCapacity != null) {
            query.addCriteria(Criteria.where("capacity").gte(minCapacity));
        }
        if (location != null && !location.trim().isEmpty()) {
            query.addCriteria(Criteria.where("location").regex(location, "i"));
        }

        return mongoTemplate.find(query, Facility.class);
    }
}
