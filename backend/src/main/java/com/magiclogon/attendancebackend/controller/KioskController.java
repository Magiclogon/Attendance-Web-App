package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.FaceVerificationResponseDTO;
import com.magiclogon.attendancebackend.dto.SetupAttendanceCameraDTO;
import com.magiclogon.attendancebackend.dto.SetupAttendanceCameraRequestDTO;
import com.magiclogon.attendancebackend.security.JwtKioskUtil;
import com.magiclogon.attendancebackend.service.EmployeeManagementService;
import com.magiclogon.attendancebackend.service.KioskService;
import com.magiclogon.attendancebackend.service.PresenceManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/kiosk")
@RequiredArgsConstructor
public class KioskController {

    private final KioskService kioskService;
    private final JwtKioskUtil jwtKioskUtil;
    private final PresenceManagementService presenceManagementService;
    private final EmployeeManagementService employeeManagementService;
    private static final String FLASK_SERVICE_URL = "http://localhost:5000/verify-face";


    // Authenticate Kiosk
    @PostMapping("/auth")
    public ResponseEntity<?> authenticateKiosk(@RequestBody SetupAttendanceCameraRequestDTO request) {
        try {
            return ResponseEntity.ok().body(Map.of(
                    "token", kioskService.authenticateByCode(request)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Setup Camera Attendance
    @GetMapping("/setup")
    public ResponseEntity<?> setupCameraAttendance(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if(!jwtKioskUtil.isKioskToken(token)) {
            return ResponseEntity.status(403).body(new ApiResponseDTO("Invalid token", false));
        }

        Integer entreprise_id = jwtKioskUtil.extractCompanyId(token);
        try {
            SetupAttendanceCameraDTO setup = kioskService.setupAttendanceCamera(entreprise_id);
            return ResponseEntity.ok(setup);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
    
    // Verify Face to mark attendance
    @PostMapping(value = "/verifyFace", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerFace(
            @RequestParam("employeeId") String employeeId,
            @RequestParam("file") MultipartFile file,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        if(!jwtKioskUtil.isKioskToken(token)) {
            return ResponseEntity.status(403).body(new ApiResponseDTO("Invalid token", false));
        }

        if(!employeeManagementService.doesEmployeeBelongToEntreprise(Integer.valueOf(employeeId), jwtKioskUtil.extractCompanyId(token))) {
            return ResponseEntity.status(400).body(new ApiResponseDTO("Employee does not belong to this entreprise", false));
        }

        RestTemplate restTemplate = new RestTemplate();

        try {
            // 1. Validate input
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "File cannot be empty"));
            }

            // 2. Prepare headers for Flask service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            // 3. Prepare multipart request body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("employee_id", employeeId);

            // Convert MultipartFile to resource while preserving filename
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename(); // Preserve original filename
                }
            };
            body.add("image", fileResource);

            // 4. Create request entity
            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            // 5. Forward to Flask service
            ResponseEntity<FaceVerificationResponseDTO> response = restTemplate.exchange(
                    FLASK_SERVICE_URL,
                    HttpMethod.POST,
                    requestEntity,
                    FaceVerificationResponseDTO.class
            );

            if(response.getStatusCode() == HttpStatus.OK) {
                try {
                    if(response.getBody() != null && response.getBody().isMatch())
                        presenceManagementService.handleEmployeePresence(Integer.valueOf(employeeId));
                    else
                        return ResponseEntity.status(400).body(new ApiResponseDTO("Faces don't match", false));
                } catch (IllegalArgumentException | IllegalStateException e) {
                    return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
                }
            }

            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(new ApiResponseDTO("Face Verified Successfully", true));

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            // Flask service returned an error (e.g., 400, 500)
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(Map.of(
                            "success", false,
                            "message", ex.getResponseBodyAsString() != null ? ex.getResponseBodyAsString() : "Error from face recognition service",
                            "details", ex.getResponseBodyAsString()
                    ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "File processing error",
                            "error", e.getMessage()
                    ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "success", false,
                            "message", "Unexpected error",
                            "error", e.getMessage()
                    ));
        }
    }
}
