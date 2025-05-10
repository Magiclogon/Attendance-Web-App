package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@NoArgsConstructor
public class Presence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    private LocalTime checkinTime;
    private LocalTime checkoutTime;
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private PresenceStatus status;

    public Presence(Employee employee, LocalTime checkinTime, LocalTime checkoutTime, LocalDate date, PresenceStatus status) {
        this.employee = employee;
        this.checkinTime = checkinTime;
        this.checkoutTime = checkoutTime;
        this.date = date;
        this.status = status;
    }
}
