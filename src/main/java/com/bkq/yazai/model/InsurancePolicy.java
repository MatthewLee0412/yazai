package com.bkq.yazai.model;

import java.time.LocalDate;

public class InsurancePolicy {

    public Long id;
    public String company;
    public String policyName;
    public String policyNo;
    public String coverage;
    public LocalDate effectiveDate;
    public LocalDate expiryDate;
    public Double premium;
    public String claimRecords;
    public String notes;
}
