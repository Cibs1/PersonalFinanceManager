package com.personal.finance.security;

import com.personal.finance.service.TokenBlacklistService;
import com.personal.finance.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // Skip JWT authentication for login and register requests
        if (requestURI.startsWith("/auth/login") || requestURI.startsWith("/auth/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("[AUTH ERROR] Missing or invalid Authorization header");
                handleUnauthorizedResponse(response, "Missing or invalid Authorization header");
                return;
            }

            jwtToken = authHeader.substring(7); // Remove "Bearer " prefix
            System.out.println("[DEBUG] Extracted Token: " + jwtToken);

            // Extract username from token
            username = jwtUtil.extractUsername(jwtToken);
            System.out.println("[DEBUG] Extracted Username from Token: " + username);

            // Check if the token is blacklisted
            if (tokenBlacklistService.isTokenBlacklisted(jwtToken)) {
                System.out.println("[AUTH ERROR] Token is blacklisted: " + jwtToken);
                handleUnauthorizedResponse(response, "Token is invalid or blacklisted");
                return;
            }

            // Validate token and set authentication context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.validateToken(jwtToken, userDetails)) {
                    System.out.println("[AUTH SUCCESS] Token is valid. User authenticated: " + username);
                    UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                } else {
                    System.out.println("[AUTH ERROR] Token validation failed. Invalid or expired token.");
                    handleUnauthorizedResponse(response, "Invalid or expired token");
                    return;
                }
            }
        } catch (Exception ex) {
            System.err.println("[AUTH ERROR] Exception during token validation: " + ex.getMessage());
            handleUnauthorizedResponse(response, "Token validation failed: " + ex.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void handleUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
