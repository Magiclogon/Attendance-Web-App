package com.magiclogon.attendancebackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AttendanceBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AttendanceBackendApplication.class, args);
    }

}
