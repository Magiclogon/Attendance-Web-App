package com.magiclogon.attendancebackend.repository;

import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Schedule;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    List<Schedule> findByEmployeeId(int employee_id);
    Optional<Schedule> findByEmployeeIdAndDate(int employee_id, LocalDate date);
    int countByEmployeeInAndDateAndIsDayOffFalse(List<Employee> employees, LocalDate date);
    List<Schedule> findByEmployeeIdAndDateIsAfterOrderByDateAsc(int employee_id, LocalDate date, Pageable pageable);

    boolean existsByEmployeeAndDateAndCheckinTimeBefore(Employee employee, LocalDate date, LocalTime time);
}
