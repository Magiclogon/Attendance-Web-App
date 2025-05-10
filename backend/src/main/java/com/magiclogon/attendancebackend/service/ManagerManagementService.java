package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.EntrepriseInfoDTO;
import com.magiclogon.attendancebackend.dto.ManagerSettingsDTO;
import com.magiclogon.attendancebackend.model.Entreprise;
import com.magiclogon.attendancebackend.model.Manager;
import com.magiclogon.attendancebackend.model.ManagerSettings;
import com.magiclogon.attendancebackend.repository.EntrepriseRepository;
import com.magiclogon.attendancebackend.repository.ManagerRepository;
import com.magiclogon.attendancebackend.repository.ManagerSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ManagerManagementService {
    private final ManagerRepository managerRepository;
    private final ManagerSettingsRepository managerSettingsRepository;
    private final EntrepriseRepository entrepriseRepository;

    private Manager getAuthenticatedManager() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return managerRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found."));
    }

    // Get Manager Settings
    public ManagerSettingsDTO getManagerSettings() {
        Manager manager = getAuthenticatedManager();
        return ManagerSettingsDTO.mapToDTO(manager.getSettings());
    }

    // Get Company Info
    public EntrepriseInfoDTO getEntrepriseInfo() {
        Manager manager = getAuthenticatedManager();
        return EntrepriseInfoDTO.mapToDo(manager.getEntreprise());
    }

    public String getEntrepriseCameraCode() {
        Manager manager = getAuthenticatedManager();
        return manager.getEntreprise().getCameraCode();
    }

    // Update Entreprise Info
    public EntrepriseInfoDTO updateEntrepriseInfo(EntrepriseInfoDTO request) {
        Manager manager = getAuthenticatedManager();
        Entreprise entreprise = manager.getEntreprise();

        entreprise.setName(request.getEntrepriseName());
        entreprise.setAddress(request.getEntrepriseAddress());
        entreprise.setSector(request.getEntrepriseSector());
        entreprise.setPhoneNumber(request.getEntreprisePhone());
        entreprise.setWebsite(request.getEntrepriseWebsite());
        entreprise.setEmail(request.getEntrepriseEmail());

        return EntrepriseInfoDTO.mapToDo(entrepriseRepository.save(entreprise));
    }

    // Update Manager settings
    public ManagerSettingsDTO updateManagerSettings(ManagerSettingsDTO request) {
        Manager manager = getAuthenticatedManager();
        ManagerSettings settings = manager.getSettings();

        settings.setAbsenceThresholdMinutes(request.getAbsenceThresholdMinutes());
        settings.setLateThresholdMinutes(request.getLateThresholdMinutes());

        return ManagerSettingsDTO.mapToDTO(managerSettingsRepository.save(settings));
    }
}
