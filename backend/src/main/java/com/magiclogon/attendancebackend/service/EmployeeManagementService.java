package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.*;
import com.magiclogon.attendancebackend.model.*;
import com.magiclogon.attendancebackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeManagementService {

    private final EmployeeRepository employeeRepository;
    private final ManagerRepository managerRepository;
    private final ScheduleRepository scheduleRepository;
    private final PresenceRepository presenceRepository;
    private final PasswordEncoder passwordEncoder;
    private final EntrepriseRepository entrepriseRepository;

    // Does Employee belong to entreprise?
    public boolean doesEmployeeBelongToEntreprise(Integer employee_id, Integer entreprise_id) {
        Employee employee = employeeRepository.findById(employee_id).orElse(null);
        if(employee == null)
            return false;
        return entreprise_id == employee.getEntreprise().getId();
    }

    // Create an employee
    public Employee addEmployee(CreateEmployeeDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();

        // Getting the manager
        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));

        if(employeeRepository.existsByEmailAndEntreprise(request.getEmployeeEmail(), manager.getEntreprise())){
            throw new IllegalArgumentException("Employee already exists.");
        }

        // Saving the employee
        Employee employee = new Employee();
        employee.setFirstName(request.getEmployeeFirstName());
        employee.setLastName(request.getEmployeeLastName());
        employee.setEmail(request.getEmployeeEmail());
        employee.setPhoneNumber(request.getEmployeePhone());
        employee.setPositionTitle(request.getEmployeePositionTitle());
        employee.setEntreprise(manager.getEntreprise());
        employee.setManager(manager);

        // Generating username and password
        employee.setUsername(request.getEmployeeLastName().toLowerCase() + request.getEmployeeFirstName().toLowerCase() + "@" + manager.getEntreprise().getName().toLowerCase());
        employee.setPassword(passwordEncoder.encode(request.getEmployeeLastName().toLowerCase() + request.getEmployeeFirstName().toLowerCase()));
        employee.setRole(Role.ROLE_EMPLOYEE);
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Integer employee_id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();

        // Getting the manager
        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));

        Employee employee = employeeRepository.findById(employee_id).orElseThrow(() -> new IllegalArgumentException("Employee not found."));
        if(!employee.getEntreprise().equals(manager.getEntreprise())) {
            throw new IllegalArgumentException("Employee does not belong to this manager.");
        }
        employeeRepository.delete(employee);
    }

    // Change employee informations
    public void updateEmployee(Integer employee_id, CreateEmployeeDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();

        // Get the manager
        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));

        // Get the employee
        Employee employee = employeeRepository.findById(employee_id).orElseThrow(() -> new IllegalArgumentException("Employee not found."));

        if(!employee.getEntreprise().equals(manager.getEntreprise())) {
            throw new IllegalArgumentException("Employee does not belong to this manager.");
        }

        if(employeeRepository.existsByEmailAndEntreprise(request.getEmployeeEmail(), manager.getEntreprise()) ||
            manager.getEmail().equalsIgnoreCase(request.getEmployeeEmail())) {
            throw new IllegalArgumentException("Email already exists within the entreprise.");
        }

        employee.setFirstName(request.getEmployeeFirstName());
        employee.setLastName(request.getEmployeeLastName());
        employee.setEmail(request.getEmployeeEmail());
        employee.setPhoneNumber(request.getEmployeePhone());
        employee.setPositionTitle(request.getEmployeePositionTitle());

        employeeRepository.save(employee);
    }

    // Return an employee in particular
    public EmployeeResponseDTO getEmployee(Integer employee_id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();

        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));
        Employee employee = employeeRepository.findById(employee_id).orElseThrow(() -> new IllegalArgumentException("Employee not found."));

        if(!employee.getEntreprise().equals(manager.getEntreprise())) {
            throw new IllegalArgumentException("Employee does not belong to this manager.");
        }

        return EmployeeResponseDTO.mapToDTO(employee);
    }

    // Return all the employees of a manager
    public List<EmployeeResponseDTO> getAllEmployees() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();

        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));

        return employeeRepository.findByEntreprise(manager.getEntreprise())
                .stream()
                .map(EmployeeResponseDTO::mapToDTO)
                .collect(Collectors.toList());

    }

    // Return all the employees of a manager with details (schedules and attendances)
    public List<EmployeeDetailedResponseDTO> getAllEmployeesWithDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();
        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));

        List<Employee> employees = manager.getEmployees();
        List<EmployeeDetailedResponseDTO> result = new ArrayList<>();

        PageRequest pageRequest = PageRequest.of(0, 7);
        for(Employee employee : employees) {
            EmployeeResponseDTO employeeDTO = EmployeeResponseDTO.mapToDTO(employee);
            List<Schedule> schedules = scheduleRepository.findByEmployeeIdAndDateIsAfterOrderByDateAsc(employee.getId(), LocalDate.now().minusDays(1), pageRequest);
            List<Presence> presences = presenceRepository.findByEmployeeIdAndDateIsBeforeOrderByDateDesc(employee.getId(), LocalDate.now().minusDays(1), pageRequest);

            List<ScheduleOfEmployeeResponseDTO> schedulesDTOs = schedules.stream()
                    .map(ScheduleOfEmployeeResponseDTO::mapToDTO)
                    .filter(Objects::nonNull)
                    .toList();

            List<EmployeePresenceDTO> presencesDTOs = presences.stream()
                    .map(EmployeePresenceDTO::mapToDTO)
                    .filter(Objects::nonNull)
                    .toList();

            result.add(new EmployeeDetailedResponseDTO(employeeDTO, schedulesDTOs, presencesDTOs));
        }

        return result;

    }

    public Integer getNumberEmployees() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String managerUsername = authentication.getName();

        Manager manager = managerRepository.findByUsername(managerUsername).orElseThrow(() -> new IllegalArgumentException("Manager not found."));
        return employeeRepository.findByEntreprise(manager.getEntreprise()).size();
    }
}
