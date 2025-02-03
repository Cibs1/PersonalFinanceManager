package com.personal.finance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.personal.finance.model.User;
import com.personal.finance.repository.UserRepository;
import com.personal.finance.util.JwtUtil;
import com.personal.finance.dto.LoginRequest;
import com.personal.finance.dto.RegisterRequest;

import java.util.Optional;
import java.util.logging.Logger;

@Service
public class UserService {

    private static final Logger LOGGER = Logger.getLogger(UserService.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public void register(RegisterRequest request) {
        LOGGER.info("Registering user: " + request.getUsername());
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());

        userRepository.save(user);
        LOGGER.info("User registered successfully: " + request.getUsername());
    }

    public String login(LoginRequest request) {
        LOGGER.info("Attempting login for username: " + request.getUsername());

        // Fetch user from the database
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        if (userOptional.isEmpty()) {
            LOGGER.warning("Login failed: User not found");
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        // Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            LOGGER.warning("Login failed: Invalid credentials");
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getUsername());
        LOGGER.info("Login successful for username: " + request.getUsername());
        return token;
    }
}
