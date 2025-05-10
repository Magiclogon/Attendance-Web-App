package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.DashboardTopStatsDTO;
import com.magiclogon.attendancebackend.service.AuthService;
import com.magiclogon.attendancebackend.service.EmployeeManagementService;
import com.magiclogon.attendancebackend.service.PresenceManagementService;
import com.magiclogon.attendancebackend.service.ScheduleManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/manager/dashboard")
public class DashboardInfoController {

    private final ScheduleManagementService scheduleManagementService;
    private final EmployeeManagementService employeeManagementService;
    private final PresenceManagementService presenceManagementService;
    private final AuthService authService;

    // Get dashboard top stats
    @GetMapping("/getDashboardTopStats")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getDashboardTopStats() {
        try {
            List<String> managerInfo = authService.getManagerInfo();
            DashboardTopStatsDTO dto = new DashboardTopStatsDTO(managerInfo.get(0),managerInfo.get(1), managerInfo.get(2),
                    employeeManagementService.getNumberEmployees(),
                    scheduleManagementService.getTodaySchedulesNumber(),
                    presenceManagementService.getNumberOfPresenceTillNow(),
                    presenceManagementService.getWeekPresenceStats());

            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
}
