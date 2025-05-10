package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.EmployeeResponseDTO;
import com.magiclogon.attendancebackend.dto.SetupAttendanceCameraDTO;
import com.magiclogon.attendancebackend.dto.SetupAttendanceCameraRequestDTO;
import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Entreprise;
import com.magiclogon.attendancebackend.repository.EntrepriseRepository;
import com.magiclogon.attendancebackend.repository.ScheduleRepository;
import com.magiclogon.attendancebackend.security.JwtKioskUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KioskService {

    private final EntrepriseRepository entrepriseRepository;
    private final ScheduleRepository scheduleRepository;
    private final JwtKioskUtil jwtKioskUtil;

    // Authenticate entreprise By CODE
    public String authenticateByCode(SetupAttendanceCameraRequestDTO request) {
        Entreprise entreprise = entrepriseRepository.findByCameraCode(request.getCameraCode()).orElseThrow(() -> new IllegalArgumentException("Camera code not found."));
        return jwtKioskUtil.generateToken(entreprise);
    }

    // Service for entering the attendance Camera
    public SetupAttendanceCameraDTO setupAttendanceCamera(Integer entreprise_id) {
        Entreprise entreprise = entrepriseRepository.findById(entreprise_id).orElseThrow(() -> new IllegalArgumentException("Entreprise not found."));

        LocalTime time_now = LocalTime.now();
        LocalDate today = LocalDate.now();

        List<EmployeeResponseDTO> listEmployees = new ArrayList<>();

        List<Employee> employees = entreprise.getEmployees();
        for(Employee employee : employees) {
            if(scheduleRepository.existsByEmployeeAndDateAndCheckinTimeBefore(employee, today, time_now.plusMinutes(20))) {
                listEmployees.add(EmployeeResponseDTO.mapToDTO(employee));
            }
        }

        return new SetupAttendanceCameraDTO(entreprise.getName(), listEmployees);
    }
}
