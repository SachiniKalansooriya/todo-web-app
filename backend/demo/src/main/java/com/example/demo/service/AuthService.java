package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public String processOAuth2User(OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String googleId = (String) attributes.get("sub");
        String profilePicture = (String) attributes.get("picture");
        
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update user info in case it changed
            user.setName(name);
            user.setProfilePicture(profilePicture);
            userRepository.save(user);
        } else {
            // Create new user
            user = new User(email, name, googleId, profilePicture);
            userRepository.save(user);
        }
        
        return jwtUtil.generateToken(user.getEmail(), user.getId());
    }
    
    public User getUserFromToken(String token) {
        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.getEmailFromToken(token);
            return userRepository.findByEmail(email).orElse(null);
        }
        return null;
    }
}