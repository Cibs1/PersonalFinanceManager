package com.personal.finance.controller;

import com.personal.finance.model.Budget;
import com.personal.finance.model.User;
import com.personal.finance.repository.BudgetRepository;
import com.personal.finance.repository.UserRepository;
import com.personal.finance.util.JwtUtil;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ Get all budgets for the logged-in user
    @GetMapping
    public ResponseEntity<List<Budget>> getBudgets(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Budget> budgets = budgetRepository.findByUser(user);
        return ResponseEntity.ok(budgets);
    }

    // ✅ Set or update a budget for a category
    @PostMapping
    public ResponseEntity<Budget> setBudget(
            @RequestHeader("Authorization") String token, 
            @Valid @RequestBody Budget budgetRequest) {
        
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Budget> existingBudget = budgetRepository.findByUserAndCategory(user, budgetRequest.getCategory());

        Budget budget = existingBudget.orElse(new Budget());
        budget.setUser(user);
        budget.setCategory(budgetRequest.getCategory());
        budget.setLimitAmount(budgetRequest.getLimitAmount());

        return ResponseEntity.ok(budgetRepository.save(budget));
    }

    // ✅ Delete a budget
    @DeleteMapping("/{category}")
    public ResponseEntity<?> deleteBudget(@RequestHeader("Authorization") String token, @PathVariable String category) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        budgetRepository.deleteByUserAndCategory(user, category);
        return ResponseEntity.ok("Budget deleted successfully");
    }
}
