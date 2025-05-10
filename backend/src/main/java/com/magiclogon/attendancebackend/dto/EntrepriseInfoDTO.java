package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.Entreprise;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EntrepriseInfoDTO {
    private String entrepriseName;
    private String entrepriseAddress;
    private String entrepriseWebsite;
    private String entreprisePhone;
    private String entrepriseEmail;
    private String entrepriseSector;

    public static EntrepriseInfoDTO mapToDo(Entreprise entreprise) {
        EntrepriseInfoDTO dto = new EntrepriseInfoDTO();
        dto.setEntrepriseName(entreprise.getName());
        dto.setEntrepriseAddress(entreprise.getAddress());
        dto.setEntrepriseWebsite(entreprise.getWebsite());
        dto.setEntrepriseEmail(entreprise.getEmail());
        dto.setEntreprisePhone(entreprise.getPhoneNumber());
        dto.setEntrepriseSector(entreprise.getSector());
        return dto;
    }
}
