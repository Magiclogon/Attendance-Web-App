package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "manager_settings")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "manager_id", referencedColumnName = "id")
    private Manager manager;

    @Column(nullable = false)
    private int absenceThresholdMinutes;

    @Column(nullable = false)
    private int lateThresholdMinutes;
}
