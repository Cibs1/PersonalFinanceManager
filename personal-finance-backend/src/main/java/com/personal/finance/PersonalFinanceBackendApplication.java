package com.personal.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableJpaRepositories("com.personal.finance.repository")
public class PersonalFinanceBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PersonalFinanceBackendApplication.class, args);
    }

}
