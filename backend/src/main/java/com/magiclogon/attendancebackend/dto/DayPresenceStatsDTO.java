package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DayPresenceStatsDTO {
    private String dayName;
    private int totalPresent;
    private int totalAbsent;
    private int totalLate;
    private int totalFree;
}