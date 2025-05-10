package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.UserResponseDTO;
import com.magiclogon.attendancebackend.model.User;
import com.magiclogon.attendancebackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
    }

    // Get user details
    public UserResponseDTO getUserDetails() {
        User user = getAuthenticatedUser();
        return UserResponseDTO.mapToDTO(user);
    }
}
