package com.sliit.smartcampus.controller.member3;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow React app
public class FileController {

    @Value("${image.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/uploads/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                // Determine content type based on file extension
                String contentType = determineContentType(filename);
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType)
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private String determineContentType(String filename) {
        if (filename.endsWith(".png")) return MediaType.IMAGE_PNG_VALUE;
        if (filename.endsWith(".gif")) return MediaType.IMAGE_GIF_VALUE;
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) return MediaType.IMAGE_JPEG_VALUE;
        return MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }
}