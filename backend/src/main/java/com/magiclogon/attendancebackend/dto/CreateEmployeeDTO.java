package com.magiclogon.attendancebackend.dto;

import lombok.Data;

@Data
public class CreateEmployeeDTO {
    private String employeeFirstName;
    private String employeeLastName;
    private String employeeEmail;
    private String employeePhone;
    private String employeePositionTitle;
}
