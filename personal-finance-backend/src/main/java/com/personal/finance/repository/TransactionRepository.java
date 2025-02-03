package com.personal.finance.repository;

import com.personal.finance.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // ✅ Fix: Add this method to filter transactions within a date range
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId AND t.date BETWEEN :startDate AND :endDate")
    List<Transaction> findByUserIdAndDateBetween(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // ✅ Fix: Find earliest transaction date for "All Time" filter
    @Query("SELECT MIN(t.date) FROM Transaction t WHERE t.user.id = :userId")
    Optional<LocalDate> findEarliestTransactionDate(@Param("userId") Long userId);

    // ✅ Optional: If `findByUserId` is missing, add it too
    List<Transaction> findByUserId(Long userId);
}
