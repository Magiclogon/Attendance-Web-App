package com.magiclogon.attendancebackend.repository;

import com.magiclogon.attendancebackend.model.Employee;
import com.magiclogon.attendancebackend.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ManagerRepository extends JpaRepository<Manager, Integer> {
    Optional<Manager> findByEmail(String email);
    Optional<Manager> findByUsername(String username);
}
