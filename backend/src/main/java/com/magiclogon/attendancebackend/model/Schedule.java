package com.magiclogon.attendancebackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@NoArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String scheduleName;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime checkinTime;
    @Column(nullable = false)
    private LocalTime checkoutTime;

    private LocalTime breakStartTime;
    private LocalTime breakEndTime;

    private Boolean isDayOff;

    public Schedule(Employee employee, String scheduleName,LocalDate date,
                          LocalTime checkInTime, LocalTime checkOutTime,
                          LocalTime breakStartTime, LocalTime breakEndTime,
                          boolean isDayOff) {
        this.employee = employee;
        this.scheduleName = scheduleName;
        this.date = date;
        this.checkinTime = checkInTime;
        this.checkoutTime = checkOutTime;
        this.breakStartTime = breakStartTime;
        this.breakEndTime = breakEndTime;
        this.isDayOff = isDayOff;
    }
}
