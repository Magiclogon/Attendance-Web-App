package com.magiclogon.attendancebackend.service;

import com.magiclogon.attendancebackend.dto.*;
import com.magiclogon.attendancebackend.model.*;
import com.magiclogon.attendancebackend.repository.*;
import com.magiclogon.attendancebackend.security.CustomUserDetailsService;
import com.magiclogon.attendancebackend.security.JwtUtil;
import com.magiclogon.attendancebackend.utils.RandomStringGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ManagerRepository managerRepository;
    private final ManagerSettingsRepository managerSettingsRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomUserDetailsService userDetailsService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    // Get manager name
    public List<String> getManagerInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userUsername = authentication.getName();
        Manager manager = managerRepository.findByUsername(userUsername).orElseThrow(() -> new IllegalArgumentException("User not found."));

        return List.of(manager.getFirstName() + " " + manager.getLastName(), manager.getEmail(), manager.getEntreprise().getName());
    }

    // Registering users
    @Transactional
    public void registerManager(RegisterRequest request) {
        // Check if they already exist
        if (managerRepository.findByEmail(request.getManagerEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }
        if (managerRepository.findByUsername(request.getManagerUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists.");
        }
        if (entrepriseRepository.findByName(request.getEntrepriseName()).isPresent()) {
            throw new IllegalArgumentException("Entreprise name already exists.");
        }

        Entreprise entreprise = new Entreprise();
        entreprise.setName(request.getEntrepriseName());
        entreprise.setSector(request.getEntrepriseSector());
        entreprise.setCameraCode(RandomStringGenerator.generateRandomString());
        entreprise.setCreatedAt(LocalDateTime.now());
        entrepriseRepository.save(entreprise);

        Manager manager = new Manager();
        manager.setFirstName(request.getManagerFirstName());
        manager.setLastName(request.getManagerLastName());
        manager.setUsername(request.getManagerUsername());
        manager.setEmail(request.getManagerEmail());
        manager.setPhoneNumber(request.getManagerPhone());
        manager.setPassword(passwordEncoder.encode(request.getManagerPassword()));
        manager.setRole(Role.ROLE_MANAGER);
        manager.setEntreprise(entreprise);
        managerRepository.save(manager);

        ManagerSettings settings = ManagerSettings.builder()
                .manager(manager)
                .absenceThresholdMinutes(30)
                .lateThresholdMinutes(10)
                .build();

        managerSettingsRepository.save(settings);
    }

    // Logging users
    public void loginUser(LoginRequest request) {
        var manager = managerRepository.findByUsername(request.getUsername());
        if(manager.isPresent()) {
            if(!passwordEncoder.matches(request.getPassword(), manager.get().getPassword())) {
                throw new IllegalArgumentException("Wrong credentials.");
            }
            return;
        }

        var employee = employeeRepository.findByUsername(request.getUsername());
        if(employee.isPresent()) {
            if(!passwordEncoder.matches(request.getPassword(), employee.get().getPassword())) {
                throw new IllegalArgumentException("Wrong credentials.");
            }
            return;
        }

        throw new IllegalArgumentException("User not found.");
    }

    // Changing password
    public void changePassword(ChangePasswordDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userUsername = authentication.getName();
        User user = userRepository.findByUsername(userUsername).orElseThrow(() -> new IllegalArgumentException("User not found."));

        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // Changing username
    public AuthResponse changeUserDetails(ChangeUserDetailsDTO request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userUsername = authentication.getName();
        User user = userRepository.findByUsername(userUsername).orElseThrow(() -> new IllegalArgumentException("User not found."));

        if(userRepository.existsByUsername(request.getNewUsername()) && !user.getUsername().equals(request.getNewUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if(!user.getUsername().equals(request.getNewUsername()))
            user.setUsername(request.getNewUsername());
        user.setPhoneNumber(request.getNewPhoneNumber());
        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getNewUsername());
        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

        // Generate new JWT token
        String newToken = jwtUtil.generateToken(userDetails);

        // Return token to client
        return new AuthResponse(newToken, role, null);
    }
}
