package com.sliit.smartcampus.controller.member1;

import com.sliit.smartcampus.entity.member1.Facility;
import com.sliit.smartcampus.service.member1.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")

public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @GetMapping
    public List<Facility> getAllFacilities(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location) {
        
        if (name != null || type != null || minCapacity != null || location != null) {
            return facilityService.searchFacilities(name, type, minCapacity, location);
        }
        return facilityService.getAllFacilities();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable String id) {
        return facilityService.getFacilityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Facility createFacility(@RequestBody Facility facility) {
        return facilityService.saveFacility(facility);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable String id, @RequestBody Facility facilityDetails) {
        return facilityService.getFacilityById(id)
                .map(facility -> {
                    facility.setName(facilityDetails.getName());
                    facility.setType(facilityDetails.getType());
                    facility.setCapacity(facilityDetails.getCapacity());
                    facility.setLocation(facilityDetails.getLocation());
                    facility.setAvailabilityWindows(facilityDetails.getAvailabilityWindows());
                    facility.setStatus(facilityDetails.getStatus());
                    Facility updatedFacility = facilityService.saveFacility(facility);
                    return ResponseEntity.ok(updatedFacility);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        if (facilityService.getFacilityById(id).isPresent()) {
            facilityService.deleteFacility(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
