package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.Schedule;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleOfEmployeeResponseDTO {
    private int scheduleId;
    private String employeeFirstName;
    private String employeeLastName;
    private String scheduleName;
    private LocalDate date;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;
    private LocalTime breakStartTime;
    private LocalTime breakEndTime;
    private Boolean isDayOff;

    public static ScheduleOfEmployeeResponseDTO mapToDTO(Schedule schedule) {
        if(schedule == null)
            return null;
        ScheduleOfEmployeeResponseDTO dto = new ScheduleOfEmployeeResponseDTO();
        dto.setScheduleId(schedule.getId());
        dto.setEmployeeFirstName(schedule.getEmployee().getFirstName());
        dto.setEmployeeLastName(schedule.getEmployee().getLastName());
        dto.setScheduleName(schedule.getScheduleName());
        dto.setDate(schedule.getDate());
        dto.setCheckinTime(schedule.getCheckinTime());
        dto.setCheckoutTime(schedule.getCheckoutTime());
        dto.setBreakStartTime(schedule.getBreakStartTime());
        dto.setBreakEndTime(schedule.getBreakEndTime());
        dto.setIsDayOff(schedule.getIsDayOff());
        return dto;
    }
}


