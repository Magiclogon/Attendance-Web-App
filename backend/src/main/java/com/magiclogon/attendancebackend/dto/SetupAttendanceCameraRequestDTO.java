package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SetupAttendanceCameraRequestDTO {
    private String cameraCode;
}
