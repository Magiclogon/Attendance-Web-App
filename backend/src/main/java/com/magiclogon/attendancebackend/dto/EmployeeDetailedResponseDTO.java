package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDetailedResponseDTO {
    private EmployeeResponseDTO employeeDetails;
    private List<ScheduleOfEmployeeResponseDTO> employeeSchedules;
    private List<EmployeePresenceDTO> employeeAttendances;
}
