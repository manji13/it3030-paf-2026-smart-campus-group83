package com.sliit.smartcampus.service.member4;

import com.sliit.smartcampus.entity.member4.User;
import com.sliit.smartcampus.repository.member4.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        // Default role for new registrations
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        // Note: For production, use BCrypt to check hashed passwords!
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        throw new RuntimeException("Invalid credentials");
    }

    /**
     * Verifies a Google OAuth access token by calling Google's userinfo endpoint,
     * then finds or creates the corresponding user in MongoDB.
     */

    public User googleLogin(String accessToken) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://www.googleapis.com/oauth2/v3/userinfo";

        try {
            // Call Google's userinfo endpoint with the access token
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            @SuppressWarnings("unchecked")
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                url, HttpMethod.GET, entity,
                (Class<Map<String, Object>>) (Class<?>) Map.class
            );

            Map<String, Object> userInfo = response.getBody();
            if (userInfo == null) {
                throw new RuntimeException("Failed to get user info from Google");
            }

            String email = (String) userInfo.get("email");
            String name  = (String) userInfo.get("name");

            if (email == null) {
                throw new RuntimeException("Email not returned by Google");
            }

            // Find existing user or auto-create a new one
            Optional<User> existing = userRepository.findByEmail(email);
            if (existing.isPresent()) {
                return existing.get();
            }

            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null ? name : email);
            newUser.setPassword(""); // Google users have no password
            newUser.setRole("USER");
            return userRepository.save(newUser);

        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed: " + e.getMessage());
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAdminUsers() {
        return userRepository.findByRole("ADMIN");
    }

    public List<User> getTechnicianUsers() {
        return userRepository.findByRole("TECHNICIAN");
    }

    public User updateRole(String id, String newRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}