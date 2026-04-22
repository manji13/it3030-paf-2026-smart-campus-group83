package com.sliit.smartcampus.service.member3;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${image.upload.dir:uploads}")
    private String uploadDir;

    public List<String> saveImages(List<MultipartFile> images) throws IOException {
        List<String> urls = new ArrayList<>();
        if (images == null || images.isEmpty()) return urls;

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        for (MultipartFile img : images) {
            String filename = UUID.randomUUID() + "_" + img.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(img.getInputStream(), filePath);
            urls.add("/uploads/" + filename);
        }
        return urls;
    }
}
