package com.queuemanager.queue_system_Backend.dto;

import lombok.Data;

@Data
public class PatientDTO {
    private String name;
    private String address;
    private Integer age;
    private String contactNumber;
}
