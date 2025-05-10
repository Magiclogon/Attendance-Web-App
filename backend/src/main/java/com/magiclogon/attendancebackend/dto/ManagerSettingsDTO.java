package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.ManagerSettings;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ManagerSettingsDTO {
    private Integer absenceThresholdMinutes;
    private Integer lateThresholdMinutes;

    public static ManagerSettingsDTO mapToDTO(ManagerSettings settings) {
        return new ManagerSettingsDTO(settings.getAbsenceThresholdMinutes(), settings.getLateThresholdMinutes());
    }
}
