package com.queuemanager.queue_system_Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.queuemanager.queue_system_Backend.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
}
