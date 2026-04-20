package com.smartcampushub.service.member1;

import com.smartcampushub.common.exception.ResourceNotFoundException;
import com.smartcampushub.dto.member1.ResourceCreateRequestMember1;
import com.smartcampushub.dto.member1.ResourceResponseMember1;
import com.smartcampushub.dto.member1.ResourceUpdateRequestMember1;
import com.smartcampushub.enums.ResourceStatus;
import com.smartcampushub.model.member1.Resource;
import com.smartcampushub.repository.member1.ResourceRepositoryMember1;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ResourceServiceMember1 {

    private final ResourceRepositoryMember1 resourceRepositoryMember1;
    private final MongoTemplate mongoTemplate;

    public ResourceResponseMember1 createResource(ResourceCreateRequestMember1 request) {
        Resource resource = Resource.builder()
                .name(request.getName().trim())
                .type(request.getType().trim())
                .capacity(request.getCapacity())
                .location(request.getLocation().trim())
                .availabilityWindows(request.getAvailabilityWindows())
                .status(request.getStatus())
                .description(request.getDescription())
                .build();

        return mapToResponse(resourceRepositoryMember1.save(resource));
    }

    public ResourceResponseMember1 updateResource(String resourceId, ResourceUpdateRequestMember1 request) {
        Resource existing = resourceRepositoryMember1.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + resourceId));

        existing.setName(request.getName().trim());
        existing.setType(request.getType().trim());
        existing.setCapacity(request.getCapacity());
        existing.setLocation(request.getLocation().trim());
        existing.setAvailabilityWindows(request.getAvailabilityWindows());
        existing.setStatus(request.getStatus());
        existing.setDescription(request.getDescription());
        existing.setUpdatedAt(Instant.now());

        return mapToResponse(resourceRepositoryMember1.save(existing));
    }

    public void deleteResource(String resourceId) {
        if (!resourceRepositoryMember1.existsById(resourceId)) {
            throw new ResourceNotFoundException("Resource not found: " + resourceId);
        }
        resourceRepositoryMember1.deleteById(resourceId);
    }

    public ResourceResponseMember1 getResourceById(String resourceId) {
        return resourceRepositoryMember1.findById(resourceId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found: " + resourceId));
    }

    public List<ResourceResponseMember1> searchResources(String type, Integer minCapacity, String location, ResourceStatus status) {
        Query query = new Query();

        if (type != null && !type.isBlank()) {
            query.addCriteria(Criteria.where("type").regex(Pattern.quote(type.trim()), "i"));
        }
        if (minCapacity != null) {
            query.addCriteria(Criteria.where("capacity").gte(minCapacity));
        }
        if (location != null && !location.isBlank()) {
            query.addCriteria(Criteria.where("location").regex(Pattern.quote(location.trim()), "i"));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        return mongoTemplate.find(query, Resource.class).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private ResourceResponseMember1 mapToResponse(Resource resource) {
        return ResourceResponseMember1.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .availabilityWindows(resource.getAvailabilityWindows())
                .status(resource.getStatus())
                .description(resource.getDescription())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
