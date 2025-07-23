package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.*;
import com.magiclogon.attendancebackend.service.EmployeeSelfService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.format.annotation.DateTimeFormat;
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
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/employeeSelf")
@RequiredArgsConstructor
public class EmployeeSelfController {

    private final EmployeeSelfService employeeSelfService;
    private static final String FLASK_SERVICE_URL = "http://localhost:5000/register-face";

    @GetMapping("/details")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getEmployeeDetails() {
        try {
            EmployeeResponseDTO details = employeeSelfService.getSelfInformation();
            return ResponseEntity.ok(details);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Get Employee Dashboard Information
    @GetMapping("/getDashboard")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getEmployeeDashboardInformation() {
        try {
            EmployeeDashboardDTO info = employeeSelfService.getEmployeeDashboardInformation();
            return ResponseEntity.ok(info);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Get Employee Schedule at date
    @GetMapping("/schedule")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getEmployeeSchedule(@RequestParam(name = "date", required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            ScheduleOfEmployeeResponseDTO schedule = employeeSelfService.getScheduleAtDate(date);
            return schedule != null ? ResponseEntity.ok(schedule) : ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponseDTO("No schedule found for this employee", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), true));
        }
    }

    @GetMapping("/presence")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> getEmployeePresence(@RequestParam(name = "date", required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            EmployeePresenceDTO attendance = employeeSelfService.getAttendanceAtDate(date);
            return attendance != null ? ResponseEntity.ok(attendance) : ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponseDTO("No presences found for this employee", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    @PostMapping(value = "/registerFace", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<?> registerFace(
            @RequestParam("employeeId") String employeeId,
            @RequestParam("file") MultipartFile file) {

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
            ResponseEntity<String> response = restTemplate.exchange(
                    FLASK_SERVICE_URL,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            employeeSelfService.setHasRegisteredFace();
            // 6. Return Flask service response directly to client
            return ResponseEntity
                    .status(response.getStatusCode())
                    .body(response.getBody());

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            // Flask service returned an error (e.g., 400, 500)
            return ResponseEntity
                    .status(ex.getStatusCode())
                    .body(Map.of(
                            "success", false,
                            "message", "Error from face recognition service",
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
