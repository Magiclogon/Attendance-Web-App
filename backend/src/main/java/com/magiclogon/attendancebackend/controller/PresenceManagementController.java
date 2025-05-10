package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.EmployeePresenceDTO;
import com.magiclogon.attendancebackend.dto.UpdatePresenceStatusDTO;
import com.magiclogon.attendancebackend.service.PresenceManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/presence")
public class PresenceManagementController {

    private final PresenceManagementService presenceManagementService;

    // Get presences of an employee at a date
    @GetMapping("/employee/{employee_id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getEmployeePresences(@PathVariable Integer employee_id,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        if(date == null) {
            date = LocalDate.now();
        }
        try {
            EmployeePresenceDTO employeePresence;
            employeePresence = presenceManagementService.getEmployeePresences(employee_id, date);
            return employeePresence != null ? ResponseEntity.ok(employeePresence) : ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponseDTO("No presences found for this employee", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Get presences records for all entreprise employees
    @GetMapping("/employees")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getAllEmployeesPresences(@RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if(date == null) {
            date = LocalDate.now();
        }
        try {
            List<EmployeePresenceDTO> employeePresences;
            employeePresences = presenceManagementService.getAllEmployeesPresences(date);
            return ResponseEntity.ok(employeePresences);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Update presence status of employee
    @PutMapping("/updatePresence/{employee_id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updatePresenceStatus(@RequestParam(name = "date", required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                  @RequestBody UpdatePresenceStatusDTO request,
                                                  @PathVariable Integer employee_id) {
        if(date == null) {
            return ResponseEntity.status(400).body(new ApiResponseDTO("Date is required", false));
        }
        try {
            EmployeePresenceDTO dto = presenceManagementService.updatePresenceStatus(date, employee_id, request);
            return ResponseEntity.status(200).body(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    /* Set Employee Present or Late
    @PutMapping("/registerAttendance/{employee_id}")
    public ResponseEntity<?> registerAttendance(@PathVariable Integer employee_id) {
        try {
            presenceManagementService.handleEmployeePresence(employee_id);
            return ResponseEntity.status(200).body(new ApiResponseDTO("Attendance registered successfully", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
    */
}
