package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.Employee;
import lombok.Data;

@Data
public class EmployeeResponseDTO {
    private int id;
    private String employeeFirstName;
    private String employeeLastName;
    private String employeeUsername;
    private String employeeEntreprise;
    private String employeeEmail;
    private String employeePhone;
    private String employeePositionTitle;

    public static EmployeeResponseDTO mapToDTO(Employee employee) {
        EmployeeResponseDTO dto = new EmployeeResponseDTO();
        dto.setId(employee.getId());
        dto.setEmployeeFirstName(employee.getFirstName());
        dto.setEmployeeLastName(employee.getLastName());
        dto.setEmployeeEmail(employee.getEmail());
        dto.setEmployeeEntreprise(employee.getEntreprise().getName());
        dto.setEmployeePhone(employee.getPhoneNumber());
        dto.setEmployeeUsername(employee.getUsername());
        dto.setEmployeePositionTitle(employee.getPositionTitle());
        return dto;
    }
}
