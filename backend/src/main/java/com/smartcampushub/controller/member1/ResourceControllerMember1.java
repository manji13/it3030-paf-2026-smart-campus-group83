package com.smartcampushub.controller.member1;

import com.smartcampushub.common.response.ApiResponse;
import com.smartcampushub.dto.member1.ResourceCreateRequestMember1;
import com.smartcampushub.dto.member1.ResourceResponseMember1;
import com.smartcampushub.dto.member1.ResourceUpdateRequestMember1;
import com.smartcampushub.enums.ResourceStatus;
import com.smartcampushub.service.member1.ResourceServiceMember1;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/member1/resources")
@RequiredArgsConstructor
public class ResourceControllerMember1 {

    private final ResourceServiceMember1 resourceServiceMember1;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponseMember1>> createResource(
            @Valid @RequestBody ResourceCreateRequestMember1 request
    ) {
        ResourceResponseMember1 created = resourceServiceMember1.createResource(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Resource created successfully", created));
    }

    @PutMapping("/{resourceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ResourceResponseMember1>> updateResource(
            @PathVariable String resourceId,
            @Valid @RequestBody ResourceUpdateRequestMember1 request
    ) {
        ResourceResponseMember1 updated = resourceServiceMember1.updateResource(resourceId, request);
        return ResponseEntity.ok(ApiResponse.ok("Resource updated successfully", updated));
    }

    @DeleteMapping("/{resourceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteResource(@PathVariable String resourceId) {
        resourceServiceMember1.deleteResource(resourceId);
        return ResponseEntity.ok(ApiResponse.ok("Resource deleted successfully", null));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<List<ResourceResponseMember1>>> getResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status
    ) {
        List<ResourceResponseMember1> resources = resourceServiceMember1.searchResources(type, minCapacity, location, status);
        return ResponseEntity.ok(ApiResponse.ok("Resources fetched successfully", resources));
    }

    @GetMapping("/{resourceId}")
    @PreAuthorize("hasAnyRole('USER','ADMIN','TECHNICIAN')")
    public ResponseEntity<ApiResponse<ResourceResponseMember1>> getResourceById(@PathVariable String resourceId) {
        ResourceResponseMember1 resource = resourceServiceMember1.getResourceById(resourceId);
        return ResponseEntity.ok(ApiResponse.ok("Resource fetched successfully", resource));
    }
}
