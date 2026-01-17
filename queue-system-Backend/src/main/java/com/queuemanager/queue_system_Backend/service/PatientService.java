package com.queuemanager.queue_system_Backend.service;

import org.springframework.stereotype.Service;

import com.queuemanager.queue_system_Backend.dto.PatientDTO;
import com.queuemanager.queue_system_Backend.entity.Patient;
import com.queuemanager.queue_system_Backend.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;
    // Business logic related to patients

    // Register Patient
    public Patient registerPatient(PatientDTO patientDto) {
        Patient patient = new Patient();
        patient.setName(patientDto.getName());
        patient.setAddress(patientDto.getAddress());
        patient.setAge(patientDto.getAge());
        patient.setContactNumber(patientDto.getContactNumber());
        
        return patientRepository.save(patient);
    }

    // Get Patient by ID
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient not found"));
    }



}
