package com.personal.finance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.personal.finance.service.UserService;
import com.personal.finance.service.TokenBlacklistService;
import com.personal.finance.repository.UserRepository;
import com.personal.finance.util.JwtUtil;
import com.personal.finance.model.User;
import com.personal.finance.dto.RegisterRequest;
import com.personal.finance.dto.LoginRequest;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    /**
     * User Registration
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            System.out.println("User registered successfully: " + request.getUsername());
            return ResponseEntity.ok("User registered successfully!");
        } catch (Exception e) {
            System.err.println("Registration failed for user: " + request.getUsername() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed: " + e.getMessage());
        }
    }

    /**
     * User Login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = userService.login(loginRequest);
            System.out.println("Login successful for user: " + loginRequest.getUsername());
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            System.err.println("Login failed for user: " + loginRequest.getUsername() + " - " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid username or password"));
        }
    }

    /**
     * Get the currently authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            // Check if token is missing
            if (token == null || !token.startsWith("Bearer ")) {
                System.err.println("[AUTH ERROR] Missing or invalid Authorization header.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authorization header is missing or invalid."));
            }

            // Extract username from JWT
            String username = jwtUtil.extractUsername(token.substring(7)); // Remove "Bearer " prefix
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Return only safe user data (avoid exposing passwords or unnecessary fields)
            Map<String, Object> userData = Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail()
            );

            System.out.println("[AUTH SUCCESS] User authenticated: " + username);
            return ResponseEntity.ok(userData);
        } catch (Exception e) {
            System.err.println("[AUTH ERROR] Token validation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token."));
        }
    }


    /**
     * Logout user (blacklist the token)
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization header is missing or invalid.");
        }

        String actualToken = token.substring(7).trim(); // Remove "Bearer " prefix
        tokenBlacklistService.blacklistToken(actualToken);
        
        System.out.println("User logged out, token blacklisted.");
        return ResponseEntity.ok("Logged out successfully!");
    }
}
