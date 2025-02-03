package com.personal.finance.repository;

import com.personal.finance.model.Budget;
import com.personal.finance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByUserAndCategory(User user, String category);
    void deleteByUserAndCategory(User user, String category);
}
