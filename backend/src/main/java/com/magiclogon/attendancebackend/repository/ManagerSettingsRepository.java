package com.magiclogon.attendancebackend.repository;

import com.magiclogon.attendancebackend.model.Manager;
import com.magiclogon.attendancebackend.model.ManagerSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagerSettingsRepository extends JpaRepository<ManagerSettings, Integer> {
    Optional<ManagerSettings> findByManagerId(Integer managerId);
    Optional<ManagerSettings> findByManager(Manager manager);
}
