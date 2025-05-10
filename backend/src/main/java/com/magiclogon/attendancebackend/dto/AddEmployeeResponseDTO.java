package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddEmployeeResponseDTO {
    private String message;
    private boolean success;
    private int employeeId;
}
