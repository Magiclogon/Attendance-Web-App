package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.EntrepriseAndManagerInfoDTO;
import com.magiclogon.attendancebackend.dto.EntrepriseInfoDTO;
import com.magiclogon.attendancebackend.dto.ManagerSettingsDTO;
import com.magiclogon.attendancebackend.service.ManagerManagementService;
import com.magiclogon.attendancebackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerManagementController {

    private final ManagerManagementService managerManagementService;
    private final UserService userService;

    // Get Manager and entreprise Info
    @GetMapping("/managerAndEntrepriseDetails")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getManagerAndEntrepriseDetails() {
        try {
            EntrepriseAndManagerInfoDTO infos = new EntrepriseAndManagerInfoDTO(
                    managerManagementService.getEntrepriseCameraCode(),
                    userService.getUserDetails(),
                    managerManagementService.getEntrepriseInfo(),
                    managerManagementService.getManagerSettings()
            );
            return ResponseEntity.ok(infos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Update Manager Settings
    @PutMapping("/updateSettings")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateManagerSettings(@RequestBody ManagerSettingsDTO request) {
        try {
            ManagerSettingsDTO settings = managerManagementService.updateManagerSettings(request);
            return ResponseEntity.ok(settings);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Update Entreprise Info
    @PutMapping("/updateEntreprise")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateEntreprise(@RequestBody EntrepriseInfoDTO request) {
        try {
            EntrepriseInfoDTO infos = managerManagementService.updateEntrepriseInfo(request);
            return ResponseEntity.ok(infos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
}
