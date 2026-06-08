package com.bkq.yazai.model;

import java.time.LocalDate;

public class MedicalVisit {

    public Long id;
    public LocalDate visitDate;
    public String hospital;
    public String department;
    public String doctor;
    public String symptoms;
    public String diagnosis;
    public String medication;
    public Double cost;
    public LocalDate followUpDate;
    public String notes;
}
