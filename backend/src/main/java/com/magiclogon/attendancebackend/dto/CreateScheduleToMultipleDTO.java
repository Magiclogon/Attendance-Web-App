package com.magiclogon.attendancebackend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateScheduleToMultipleDTO {
    private List<Integer> employees_ids;
    private CreateScheduleDTO schedule;
}
