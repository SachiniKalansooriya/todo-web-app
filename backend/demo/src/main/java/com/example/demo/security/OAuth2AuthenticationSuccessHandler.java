package com.example.demo.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.example.demo.service.AuthService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Object principal = authentication.getPrincipal();
        if (principal instanceof OAuth2User oauth2User) {
            String token = authService.processOAuth2User(oauth2User);
            String encoded = URLEncoder.encode(token, StandardCharsets.UTF_8);
            // Redirect to frontend callback with token
            String redirectUrl = "http://localhost:4200/auth/callback?token=" + encoded;
            response.sendRedirect(redirectUrl);
        } else {
            // Fallback: redirect to frontend without token
            response.sendRedirect("http://localhost:4200/login?error=auth_failed");
        }
    }
}
