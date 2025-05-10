package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Presence;
import com.magiclogon.attendancebackend.model.PresenceStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EmployeePresenceDTO {
    private int employeeId;
    private String employeeFirstName;
    private String employeeLastName;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;
    private LocalDate date;
    private PresenceStatus status;

    public static EmployeePresenceDTO mapToDTO(Presence presence) {
        if(presence == null)
            return null;

        EmployeePresenceDTO dto = new EmployeePresenceDTO();
        dto.setEmployeeId(presence.getEmployee().getId());
        dto.setEmployeeFirstName(presence.getEmployee().getFirstName());
        dto.setEmployeeLastName(presence.getEmployee().getLastName());
        dto.setCheckinTime(presence.getCheckinTime());
        dto.setCheckoutTime(presence.getCheckoutTime());
        dto.setDate(presence.getDate());
        dto.setStatus(presence.getStatus());
        return dto;
    }
}