package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.EmployeeDashboardDTO;
import com.magiclogon.attendancebackend.dto.EmployeePresenceDTO;
import com.magiclogon.attendancebackend.dto.EmployeeResponseDTO;
import com.magiclogon.attendancebackend.dto.ScheduleOfEmployeeResponseDTO;
import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Manager;
import com.magiclogon.attendancebackend.model.Presence;
import com.magiclogon.attendancebackend.model.Schedule;
import com.magiclogon.attendancebackend.repository.EmployeeRepository;
import com.magiclogon.attendancebackend.repository.PresenceRepository;
import com.magiclogon.attendancebackend.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmployeeSelfService {

    private final EmployeeRepository employeeRepository;
    private final ScheduleRepository scheduleRepository;
    private final PresenceRepository presenceRepository;

    private Employee getAuthenticatedEmployee() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found."));
    }

    // Get Self Information
    public EmployeeResponseDTO getSelfInformation() {
        Employee employee = getAuthenticatedEmployee();
        return EmployeeResponseDTO.mapToDTO(employee);
    }

    // Get all employee Information (Infos, schedules, attendances,...)
    public EmployeeDashboardDTO getEmployeeDashboardInformation() {
        Employee employee = getAuthenticatedEmployee();

        EmployeeResponseDTO employeeInfo = EmployeeResponseDTO.mapToDTO(employee);
        PageRequest pageRequest = PageRequest.of(0, 5);
        List<Schedule> schedules = scheduleRepository.findByEmployeeIdAndDateIsAfterOrderByDateAsc(employee.getId(), LocalDate.now(), pageRequest);
        List<Presence> presences = presenceRepository.findByEmployeeIdAndDateIsBeforeOrderByDateDesc(employee.getId(), LocalDate.now(), pageRequest);

        List<ScheduleOfEmployeeResponseDTO> schedulesDTOs = schedules.stream()
                .map(ScheduleOfEmployeeResponseDTO::mapToDTO)
                .filter(Objects::nonNull)
                .toList();

        List<EmployeePresenceDTO> presencesDTOs = presences.stream()
                .map(EmployeePresenceDTO::mapToDTO)
                .filter(Objects::nonNull)
                .toList();

        return new EmployeeDashboardDTO(employeeInfo, schedulesDTOs, presencesDTOs);
    }

    // Get schedule at date
    public ScheduleOfEmployeeResponseDTO getScheduleAtDate(LocalDate date) {
        Employee employee = getAuthenticatedEmployee();
        return scheduleRepository.findByEmployeeIdAndDate(employee.getId(), date)
                .map(ScheduleOfEmployeeResponseDTO::mapToDTO)
                .orElse(null);
    }

    // Get attendance at date
    public EmployeePresenceDTO getAttendanceAtDate(LocalDate date) {
        Employee employee = getAuthenticatedEmployee();
        return EmployeePresenceDTO.mapToDTO(presenceRepository.findByEmployeeIdAndDate(employee.getId(), date));
    }

    public void setHasRegisteredFace() {
        Employee employee = getAuthenticatedEmployee();
        employee.setHasRegisteredFace(true);
        employeeRepository.save(employee);
    }
}
