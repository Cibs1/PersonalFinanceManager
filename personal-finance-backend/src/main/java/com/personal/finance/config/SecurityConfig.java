package com.personal.finance.config;

import com.personal.finance.security.JwtAuthenticationFilter;
import com.personal.finance.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API endpoints
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS for frontend-backend communication
            .authorizeHttpRequests(auth -> auth
                // ✅ Public access for login & register
                .requestMatchers("/", "/favicon.ico", "/auth/register", "/auth/login").permitAll()

                // ✅ Authenticated users can access transactions
                .requestMatchers(HttpMethod.GET, "/api/transactions/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/transactions/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/api/transactions/**").hasRole("USER")

                // ✅ Allow access to budgets
                .requestMatchers(HttpMethod.GET, "/api/budgets/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/budgets/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/api/budgets/**").hasRole("USER")

                // ✅ Default: Protect all other endpoints
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider()) // Use custom authentication provider
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class); // Add JWT filter before UsernamePasswordAuthenticationFilter

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000")); // Add frontend origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Allowed HTTP methods
        config.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Allowed headers
        config.setAllowCredentials(true); // Allow cookies and credentials

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Apply CORS config to all endpoints
        return source;
    }
}
