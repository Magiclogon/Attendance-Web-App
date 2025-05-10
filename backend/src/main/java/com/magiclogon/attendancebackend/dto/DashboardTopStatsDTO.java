package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DashboardTopStatsDTO {
    String managerName;
    String managerEmail;
    String companyName;
    int totalEmployees;
    int totalSchedules;
    int totalAttendances;
    List<DayPresenceStatsDTO> weekPresenceStats;
}
