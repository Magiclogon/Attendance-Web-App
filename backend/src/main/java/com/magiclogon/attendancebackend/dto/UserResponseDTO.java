package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private int userId;
    private String userFirstName;
    private String userLastName;
    private String userEmail;
    private String userPhone;
    private String userUsername;

    public static UserResponseDTO mapToDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getUsername()
        );
    }
}
