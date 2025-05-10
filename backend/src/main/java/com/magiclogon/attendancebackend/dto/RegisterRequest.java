package com.magiclogon.attendancebackend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String managerFirstName;
    private String managerLastName;
    private String managerUsername;
    private String managerEmail;
    private String managerPhone;
    private String managerPassword;
    private String entrepriseName;
    private String entrepriseSector;


}
