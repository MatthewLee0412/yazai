package com.bkq.yazai.model;

import java.time.LocalDate;

public class VaccineRecord {

    public Long id;
    public Long templateId;
    public String vaccineName;
    public String ageLabel;
    public String doseLabel;
    public LocalDate plannedDate;
    public LocalDate vaccinatedDate;
    public String location;
    public String batchNo;
    public String doctor;
    public String status;
    public String notes;
}
