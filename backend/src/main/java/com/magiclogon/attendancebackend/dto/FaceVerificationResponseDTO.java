package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FaceVerificationResponseDTO {
    private double confidence;
    private String employee_id;
    private boolean match;
    private boolean success;
    private double threshold;
}
