package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@DiscriminatorValue("EMPLOYEE")
public class Employee extends User {

    @ManyToOne
    @JoinColumn(name = "entreprise_id", referencedColumnName = "id")
    private Entreprise entreprise;

    @Column(nullable = false)
    private String positionTitle;

    @OneToMany(mappedBy = "employee")
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "employee")
    private List<Presence> presences;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;

    @Column(nullable = false)
    private boolean hasRegisteredFace = false;

}
