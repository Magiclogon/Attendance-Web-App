package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.CreateScheduleDTO;
import com.magiclogon.attendancebackend.dto.CreateScheduleToMultipleDTO;
import com.magiclogon.attendancebackend.dto.ScheduleOfEmployeeResponseDTO;
import com.magiclogon.attendancebackend.service.ScheduleManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleManagementController {

    private final ScheduleManagementService scheduleManagementService;

    @PostMapping("/addSchedule")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> addSchedule(@RequestBody CreateScheduleToMultipleDTO request) {

        try {
            List<Integer> unsuccessful_ids = new ArrayList<>();
            unsuccessful_ids = scheduleManagementService.addScheduleToMultipleEmployees(request.getEmployees_ids(), request.getSchedule());
            if(unsuccessful_ids.isEmpty()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO("Schedule added successfully", true));
            } else {
                return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO("Some employees were not added successfully: " + unsuccessful_ids.stream().map(Object::toString)
                        .collect(Collectors.joining(", ")), false));
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }

    }

    @GetMapping("/showSchedule/{employee_id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getScheduleOfEmployee(@PathVariable Integer employee_id, @RequestParam(name = "date", required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            ScheduleOfEmployeeResponseDTO schedule;
            schedule = scheduleManagementService.getSchedulesOfEmployee(employee_id, date);
            return schedule != null ? ResponseEntity.ok(schedule) : ResponseEntity.status(HttpStatus.NO_CONTENT).body(new ApiResponseDTO("No schedule found for this employee", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    @GetMapping("/showAllSchedules")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getScheduleOfAllEmployees(@RequestParam(name = "date", required = true) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            List<ScheduleOfEmployeeResponseDTO> schedules;
            schedules = scheduleManagementService.getSchedulesOfAllEmployees(date);
            return ResponseEntity.ok(schedules);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
}
