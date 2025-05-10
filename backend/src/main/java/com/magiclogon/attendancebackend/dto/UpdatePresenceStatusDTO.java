package com.magiclogon.attendancebackend.dto;

import com.magiclogon.attendancebackend.model.PresenceStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpdatePresenceStatusDTO {
    private PresenceStatus presenceStatus;
}
