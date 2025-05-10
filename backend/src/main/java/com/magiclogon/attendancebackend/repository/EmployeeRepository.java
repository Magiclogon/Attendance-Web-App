package com.magiclogon.attendancebackend.repository;

import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Optional<Employee> findByUsername(String username);
    Boolean existsByEmailAndEntreprise(String email, Entreprise entreprise);
    Boolean existsByEmail(String email);
    List<Employee> findByEntreprise(Entreprise entreprise);
}
