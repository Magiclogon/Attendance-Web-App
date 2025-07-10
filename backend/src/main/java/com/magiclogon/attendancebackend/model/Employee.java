package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.util.List;

@Data
@Entity
@DiscriminatorValue("EMPLOYEE")
public class Employee extends User {

    @ManyToOne
    @JoinColumn(name = "entreprise_id", referencedColumnName = "id")
    private Entreprise entreprise;

    @Column(nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'NONE'")
    private String positionTitle;

    @OneToMany(mappedBy = "employee")
    private List<Schedule> schedules;

    @OneToMany(mappedBy = "employee")
    private List<Presence> presences;

    @ManyToOne
    @JoinColumn(name = "manager_id")
    private Manager manager;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean hasRegisteredFace = false;

}
