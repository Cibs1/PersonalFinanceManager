package com.personal.finance.controller;

import com.personal.finance.model.Transaction;
import com.personal.finance.model.User;
import com.personal.finance.repository.TransactionRepository;
import com.personal.finance.repository.UserRepository;
import com.personal.finance.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public List<Transaction> getUserTransactions(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUserId(user.getId());
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody Transaction transaction
    ) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        transaction.setUser(user);
        return ResponseEntity.ok(transactionRepository.save(transaction));
    }

    // ✅ FIXED: Convert BigDecimal to double
    @GetMapping("/categories")
    public ResponseEntity<Map<String, Double>> getTransactionsByCategory(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch transactions and group by category
        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());
        Map<String, Double> categoryTotals = transactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.summingDouble(t -> t.getAmount().doubleValue()) // ✅ FIXED: Convert BigDecimal to double
                ));

        return ResponseEntity.ok(categoryTotals);
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Double>> getMonthlyExpenses(
            @RequestHeader("Authorization") String token,
            @RequestParam("range") String range) {

        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        if ("all".equals(range)) {
            startDate = transactionRepository.findEarliestTransactionDate(user.getId())
                                        .orElse(LocalDate.now().minusYears(20)); // ✅ Default to 20 years ago if no transactions found
        } else {
            int years = Integer.parseInt(range);
            startDate = endDate.minusYears(years);
        }

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate);

        Map<String, Double> expenses = transactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().format(DateTimeFormatter.ofPattern("yyyy-MMMM")),
                        TreeMap::new, // ✅ Sorted order
                        Collectors.summingDouble(t -> t.getAmount().doubleValue()) // ✅ FIXED: Convert BigDecimal to double
                ));

        return ResponseEntity.ok(expenses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
                @RequestHeader("Authorization") String token,
                @PathVariable Long id) {
        String username = jwtUtil.extractUsername(token.substring(7));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!transaction.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized: You can only delete your own transactions.");
        }

        transactionRepository.delete(transaction);
        return ResponseEntity.ok().body("Transaction deleted successfully.");
        }

        
}
