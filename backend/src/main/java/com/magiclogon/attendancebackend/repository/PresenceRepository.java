package com.magiclogon.attendancebackend.repository;

import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Presence;
import com.magiclogon.attendancebackend.model.PresenceStatus;
import com.magiclogon.attendancebackend.model.Schedule;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PresenceRepository extends JpaRepository<Presence, Integer> {
    List<Presence> findByEmployeeId(int employeeId);

    Presence findByEmployeeIdAndDate(int employeeId, LocalDate date);

    List<Presence> findByDate(LocalDate date);

    Optional<Presence> findTopByEmployeeIdOrderByDateDesc(int employeeId);

    boolean existsByEmployeeAndDate(Employee employee, LocalDate date);

    int countByEmployeeInAndDateAndStatusIn(List<Employee> employees, LocalDate date, List<PresenceStatus> statuses);

    List<Presence> findByEmployeeIdAndDateIsBeforeOrderByDateDesc(int employee_id, LocalDate date, Pageable pageable);
}
