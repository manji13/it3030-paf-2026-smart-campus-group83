package com.sliit.smartcampus.controller.member4;

import com.sliit.smartcampus.entity.member4.User;
import com.sliit.smartcampus.service.member4.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Connects to React
public class UserController {

    @Autowired
    private UserService userService;

    // 1. POST - Register
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    // 2. POST - Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            User user = userService.loginUser(credentials.get("email"), credentials.get("password"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 3. GET - Fetch all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 4. PUT - Update Role
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateRole(@PathVariable String id, @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(userService.updateRole(id, payload.get("role")));
    }

    // 5. DELETE - Delete User
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}