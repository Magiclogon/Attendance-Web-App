package com.magiclogon.attendancebackend.controller;


import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class HealthStatus {

    @GetMapping("/health")
    public ResponseEntity<ApiResponseDTO> checkHealth() {
        return ResponseEntity.ok().body(new ApiResponseDTO("Healthy", true));
    }
}
