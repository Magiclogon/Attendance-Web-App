package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@DiscriminatorValue("MANAGER")
@Entity
@Data
public class Manager extends User {

    @OneToOne
    @JoinColumn(name = "entreprise_id", referencedColumnName = "id")
    private Entreprise entreprise;

    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Employee> employees;

    @OneToOne(mappedBy = "manager", cascade = CascadeType.ALL, fetch = FetchType.LAZY, optional = false)
    private ManagerSettings settings;
}
