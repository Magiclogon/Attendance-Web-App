package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.RecurringType;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateScheduleDTO {
    private String scheduleName;
    private LocalDate date;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;
    private LocalTime breakStartTime;
    private LocalTime breakEndTime;
    private Boolean isDayOff;
    private RecurringType recurringType;
}
