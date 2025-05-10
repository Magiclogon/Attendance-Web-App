package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponseDTO {
    private String message;
    private boolean success;
}
