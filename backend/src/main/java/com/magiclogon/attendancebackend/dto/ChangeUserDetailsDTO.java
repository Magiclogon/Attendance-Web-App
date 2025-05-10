package com.magiclogon.attendancebackend.dto;

import lombok.Data;

@Data
public class ChangeUserDetailsDTO {
    private String newUsername;
    private String newPhoneNumber;
}
