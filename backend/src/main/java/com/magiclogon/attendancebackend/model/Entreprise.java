package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String name;

    private String email;
    private String phoneNumber;
    private String website;
    private String sector;
    private String address;
    private LocalDateTime createdAt;

    private String cameraCode;

    @OneToOne(mappedBy = "entreprise")
    private Manager manager;

    @OneToMany(mappedBy = "entreprise")
    private List<Employee> employees;
}
