package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.*;
import com.magiclogon.attendancebackend.model.*;
import com.magiclogon.attendancebackend.repository.*;
import com.magiclogon.attendancebackend.security.JwtKioskUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PresenceManagementService {
    private final PresenceRepository presenceRepository;
    private final ManagerRepository managerRepository;
    private final ManagerSettingsRepository managerSettingsRepository;
    private final EmployeeRepository employeeRepository;
    private final ScheduleRepository scheduleRepository;

    // Authentication
    private Manager getAuthenticatedManager() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return managerRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found."));
    }

    // VAlidate that employee is bien du Manager
    private Employee validateEmployeeBelongsToManager(Integer employeeId, Manager manager) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found."));
        if (!employee.getEntreprise().equals(manager.getEntreprise()))
            throw new IllegalArgumentException("Employee does not belong to this manager.");
        return employee;
    }

    // Get employee presences
    public EmployeePresenceDTO getEmployeePresences(Integer employee_id, LocalDate date) {
        Manager manager = getAuthenticatedManager();
        Employee employee = validateEmployeeBelongsToManager(employee_id, manager);
        return EmployeePresenceDTO.mapToDTO(presenceRepository.findByEmployeeIdAndDate(employee_id, date));
    }

    // Get all employees presences
    public List<EmployeePresenceDTO> getAllEmployeesPresences(LocalDate date){
        Manager manager = getAuthenticatedManager();
        List<Employee> employees = employeeRepository.findByEntreprise(manager.getEntreprise());
        return employees.stream()
                .map(employee -> EmployeePresenceDTO.mapToDTO(presenceRepository.findByEmployeeIdAndDate(employee.getId(), date)))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // Handle Employee Presence (Automatic)
    public void handleEmployeePresence(Integer employeeId) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Fetch employee and schedule
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("Employee not found."));

        Schedule schedule = scheduleRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found for today."));

        if (Boolean.TRUE.equals(schedule.getIsDayOff())) {
            throw new IllegalArgumentException("Today is a day off.");
        }

        Presence presence = presenceRepository.findByEmployeeIdAndDate(employeeId, today);
        if (presence == null) {
            presence = new Presence();
            presence.setEmployee(employee);
            presence.setDate(today);
            presence.setStatus(PresenceStatus.NOT_OPENED); // initial default
            presenceRepository.save(presence);
            log.info("Presence record initialized for employee {} on {}", employeeId, today);
        }

        LocalTime checkinTime = schedule.getCheckinTime();
        LocalTime checkoutTime = schedule.getCheckoutTime();
        ManagerSettings settings = managerSettingsRepository.findByManager(employee.getManager())
                .orElseThrow(() -> new IllegalStateException("Manager settings not found."));
        int lateThresholdMinutes = settings.getLateThresholdMinutes();

        PresenceStatus currentStatus = presence.getStatus();

        // If already checked in (PRESENT or LATE), check if it's checkout time
        if (EnumSet.of(PresenceStatus.PRESENT, PresenceStatus.LATE).contains(currentStatus)) {
            if (now.isAfter(checkoutTime)) {
                if (presence.getCheckoutTime() != null) {
                    throw new IllegalArgumentException("Checkout has already been recorded.");
                }
                presence.setCheckoutTime(now);
                presenceRepository.save(presence);
                log.info("Checkout recorded for employee {}", employeeId);
            } else {
                throw new IllegalArgumentException("Too early for checkout. You can check out after " + checkoutTime);
            }
            return;
        }

        // If already checked in or out
        if (presence.getCheckinTime() != null) {
            throw new IllegalArgumentException("Check-in already recorded.");
        }

        // Check if now is within valid check-in period
        if (now.isBefore(checkinTime.minusMinutes(20))) {
            throw new IllegalArgumentException("Too early to check in.");
        }

        // Determine status based on lateness
        if (now.isBefore(checkinTime.plusMinutes(lateThresholdMinutes))) {
            presence.setStatus(PresenceStatus.PRESENT);
        } else if (now.isBefore(checkoutTime)) {
            presence.setStatus(PresenceStatus.LATE);
        } else {
            throw new IllegalArgumentException("Invalid check-in time. You're too late.");
        }

        presence.setCheckinTime(now);
        presenceRepository.save(presence);
        log.info("Check-in recorded for employee {} with status {}", employeeId, presence.getStatus());
    }


    // Update manually presence
    public EmployeePresenceDTO updatePresenceStatus(LocalDate date, int employeeId, UpdatePresenceStatusDTO request) {
        Manager manager = getAuthenticatedManager();
        Employee employee = validateEmployeeBelongsToManager(employeeId, manager);

        Presence presence = presenceRepository.findByEmployeeIdAndDate(employeeId, date);
        if(presence == null) {
            throw new IllegalArgumentException("Presence record not found for employee.");
        }

        presence.setStatus(request.getPresenceStatus());
        return EmployeePresenceDTO.mapToDTO(presenceRepository.save(presence));
    }

    // Get number of presence till now
    public Integer getNumberOfPresenceTillNow() {
        Manager manager = getAuthenticatedManager();
        LocalDate today = LocalDate.now();
        List<PresenceStatus> statuses = List.of(PresenceStatus.PRESENT, PresenceStatus.LATE);
        List<Employee> employees = manager.getEmployees();
        return presenceRepository.countByEmployeeInAndDateAndStatusIn(employees, today, statuses);
    }

    // Get Week stats (Dashboard)
    public List<DayPresenceStatsDTO> getWeekPresenceStats() {
        Manager manager = getAuthenticatedManager();
        List<Employee> employees = manager.getEmployees();
        List<DayPresenceStatsDTO> result = new ArrayList<>();

        for(int i = 6; i >= 1; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String day = date.getDayOfWeek().name();

            int present = presenceRepository.countByEmployeeInAndDateAndStatusIn(employees, date, List.of(PresenceStatus.PRESENT));
            int late = presenceRepository.countByEmployeeInAndDateAndStatusIn(employees, date, List.of(PresenceStatus.LATE));
            int absent = presenceRepository.countByEmployeeInAndDateAndStatusIn(employees, date, List.of(PresenceStatus.ABSENT));
            int free = presenceRepository.countByEmployeeInAndDateAndStatusIn(employees, date, List.of(PresenceStatus.FREE));

            result.add(new DayPresenceStatsDTO(day, present, absent, late, free));
        }
        return result;
    }

    // Mark absent employees
    @Scheduled(cron = "0 */10 * * * *")
    public void markAbsentEmployeesAfterThreshold() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Employee> employees = employeeRepository.findAll();

        for (Employee employee : employees) {
            Schedule schedule = scheduleRepository.findByEmployeeIdAndDate(employee.getId(), today).orElse(null);
            if (schedule == null || Boolean.TRUE.equals(schedule.getIsDayOff())) continue;

            // Get manager's threshold (in minutes)
            ManagerSettings settings = managerSettingsRepository.findByManager(employee.getManager())
                    .orElse(null);
            if (settings == null) continue;

            LocalTime checkinTime = schedule.getCheckinTime();
            int thresholdMinutes = settings.getAbsenceThresholdMinutes();

            if (now.isBefore(checkinTime.plusMinutes(thresholdMinutes))) continue;

            Presence presence = presenceRepository.findByEmployeeIdAndDate(employee.getId(), today);
            if (presence == null) {
                presence = new Presence();
                presence.setEmployee(employee);
                presence.setDate(today);
                presence.setStatus(PresenceStatus.ABSENT);
                presenceRepository.save(presence);
            } else if (presence.getStatus() == PresenceStatus.NOT_OPENED) {
                presence.setStatus(PresenceStatus.ABSENT);
                presenceRepository.save(presence);
            }
        }
    }

    // Create presence objects at the beginning of the day
    @Scheduled(cron = "0 0 6 * * *")
    public void createPresenceObjects() {
        LocalDate today = LocalDate.now();
        for (Employee employee : employeeRepository.findAll()) {
            if (presenceRepository.existsByEmployeeAndDate(employee, today)) continue;

            Schedule schedule = scheduleRepository.findByEmployeeIdAndDate(employee.getId(), today).orElse(null);
            Presence presence = new Presence();
            presence.setEmployee(employee);
            presence.setDate(today);
            presence.setStatus((schedule == null || Boolean.TRUE.equals(schedule.getIsDayOff())) ? PresenceStatus.FREE : PresenceStatus.NOT_OPENED);
            presenceRepository.save(presence);
        }
    }
}
