package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.AuthResponse;
import com.magiclogon.attendancebackend.dto.ChangePasswordDTO;
import com.magiclogon.attendancebackend.dto.ChangeUserDetailsDTO;
import com.magiclogon.attendancebackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/changeCreds")
@RequiredArgsConstructor
public class ChangeCredsController {

    private final AuthService authService;

    @PostMapping("/changePassword")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO request) {
        try {
            authService.changePassword(request);
            return ResponseEntity.status(200).body(new ApiResponseDTO("Password changed successfully", true));
        } catch (IllegalArgumentException e) {
            if(e.getMessage().equals("Wrong password")) {
                return ResponseEntity.status(401).body(new ApiResponseDTO("Wrong password", false));
            } else {
                return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
            }
        }
    }

    @PostMapping("/changeUserDetails")
    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE')")
    public ResponseEntity<?> changeUserDetails(@RequestBody ChangeUserDetailsDTO request) {
        try {
            AuthResponse response = authService.changeUserDetails(request);
            return ResponseEntity.status(200).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
}
