package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.*;
import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.service.EmployeeManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class EmployeeManagementController {

    private final EmployeeManagementService employeeManagementService;

    @PostMapping("/addEmployee")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> addEmployee(@RequestBody CreateEmployeeDTO request) {
        try {
            Employee savedEmployee = employeeManagementService.addEmployee(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(new AddEmployeeResponseDTO("Employee created successfully", true, savedEmployee.getId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    // Delete Employee
    @DeleteMapping("/deleteEmployee/{employee_id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Integer employee_id) {
        try {
            employeeManagementService.deleteEmployee(employee_id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDTO("Employee deleted successfully", true));
    }

    // Update Employee Informations
    @PutMapping("/updateEmployee/{employee_id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateEmployee(@PathVariable Integer employee_id, @RequestBody CreateEmployeeDTO request) {
        try {
            employeeManagementService.updateEmployee(employee_id, request);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponseDTO("Employee updated successfully", true));
    }

    @GetMapping("/employee/{employee_id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getEmployee(@PathVariable Integer employee_id) {
        EmployeeResponseDTO employee;
        try {
            employee = employeeManagementService.getEmployee(employee_id);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
        return ResponseEntity.ok(employee);
    }

    // Get all employees
    @GetMapping("/employees")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees() {
        List<EmployeeResponseDTO> employees = employeeManagementService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    // Get all employees but detailed
    @GetMapping("/detailedEmployees")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> getAllEmployeesWithDetails() {
        try {
            List<EmployeeDetailedResponseDTO> employees = employeeManagementService.getAllEmployeesWithDetails();
            return ResponseEntity.ok(employees);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
}
