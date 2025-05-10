package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.CreateScheduleDTO;
import com.magiclogon.attendancebackend.dto.ScheduleOfEmployeeResponseDTO;
import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Manager;
import com.magiclogon.attendancebackend.model.Schedule;
import com.magiclogon.attendancebackend.repository.EmployeeRepository;
import com.magiclogon.attendancebackend.repository.ManagerRepository;
import com.magiclogon.attendancebackend.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleManagementService {

    private final ScheduleRepository scheduleRepository;
    private final ManagerRepository managerRepository;
    private final EmployeeRepository employeeRepository;

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

    // Add the schedule to multiple Employees
    public ArrayList<Integer> addScheduleToMultipleEmployees(List<Integer> employees_ids, CreateScheduleDTO request) {
        Manager manager = getAuthenticatedManager();
        ArrayList<Integer> unsuccessful_ids = new ArrayList<>();

        for(Integer employee_id : employees_ids) {
            Optional<Employee> employee = employeeRepository.findById(employee_id);
            if(!employee.isPresent()) {
                unsuccessful_ids.add(employee_id);
                continue;
            }

            if (!employee.get().getEntreprise().equals(manager.getEntreprise())) {
                unsuccessful_ids.add(employee_id);
                continue;
            }

            // See if there's a schedule like that one.
            scheduleRepository.findByEmployeeIdAndDate(employee_id, request.getDate()).ifPresent(scheduleRepository::delete);

            Schedule schedule = new Schedule(employee.get(), request.getScheduleName(), request.getDate(), request.getCheckinTime(), request.getCheckoutTime(),
                    request.getBreakStartTime(), request.getBreakEndTime(), request.getIsDayOff());

            scheduleRepository.save(schedule);
        }

        return unsuccessful_ids;
    }

    // Get schedules of an employee
    public ScheduleOfEmployeeResponseDTO getSchedulesOfEmployee(Integer employee_id, LocalDate date) {
        Manager manager = getAuthenticatedManager();
        Employee employee = validateEmployeeBelongsToManager(employee_id, manager);

        return scheduleRepository.findByEmployeeIdAndDate(employee_id, date)
                .map(ScheduleOfEmployeeResponseDTO::mapToDTO)
                .orElse(null);
                
    }
    
    // Get all employees schedules
    public List<ScheduleOfEmployeeResponseDTO> getSchedulesOfAllEmployees(LocalDate date) {
        Manager manager = getAuthenticatedManager();
        List<Employee> employees = manager.getEmployees();

        return employees.stream()
                .flatMap(employee -> scheduleRepository.findByEmployeeIdAndDate(employee.getId(), date).stream())
                .map(ScheduleOfEmployeeResponseDTO::mapToDTO)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Integer getTodaySchedulesNumber() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();
        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));

        LocalDate today = LocalDate.now();
        List<Employee> employees = manager.getEmployees();

        return scheduleRepository.countByEmployeeInAndDateAndIsDayOffFalse(employees, today);
    }
}
