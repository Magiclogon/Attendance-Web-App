package com.magiclogon.attendancebackend.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String role;
    private Boolean hasRegisteredFace;

    public AuthResponse(String token, String role, Boolean hasRegisteredFace) {
        this.token = token;
        this.role = role;
        this.hasRegisteredFace = hasRegisteredFace;
    }
}
