package com.magiclogon.attendancebackend.controller;

import com.magiclogon.attendancebackend.dto.ApiResponseDTO;
import com.magiclogon.attendancebackend.dto.AuthResponse;
import com.magiclogon.attendancebackend.dto.LoginRequest;
import com.magiclogon.attendancebackend.dto.RegisterRequest;
import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.repository.EmployeeRepository;
import com.magiclogon.attendancebackend.security.JwtUtil;
import com.magiclogon.attendancebackend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerManager(@RequestBody RegisterRequest registerRequest) {
        try {
            authService.registerManager(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponseDTO("Registration Successful", true));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginManager(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user using the authentication manager
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // If authentication is successful, generate JWT token
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtUtil.generateToken(userDetails);
            String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();

            // Call your existing login service
            authService.loginUser(loginRequest);

            Boolean hasRegisteredFace = null;
            if (role.equals("ROLE_EMPLOYEE")) {
                Optional<Employee> employeeOpt = employeeRepository.findByUsername(loginRequest.getUsername());
                if (employeeOpt.isPresent()) {
                    hasRegisteredFace = employeeOpt.get().isHasRegisteredFace();
                }
            }

            // Return the token in the response
            return ResponseEntity.ok(new AuthResponse(token, role, hasRegisteredFace));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponseDTO("Invalid username or password", false));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponseDTO(e.getMessage(), false));
        }
    }
}
