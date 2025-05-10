package com.magiclogon.attendancebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntrepriseAndManagerInfoDTO {
    private String entrepriseCameraCode;
    private UserResponseDTO managerDetails;
    private EntrepriseInfoDTO entrepriseInfo;
    private ManagerSettingsDTO managerSettings;
}
