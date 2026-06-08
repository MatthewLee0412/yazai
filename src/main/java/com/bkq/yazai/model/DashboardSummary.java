package com.bkq.yazai.model;

import java.util.ArrayList;
import java.util.List;

public class DashboardSummary {

    public BabyProfile baby;
    public GrowthRecord latestGrowth;
    public VaccineRecord nextVaccine;
    public MedicalVisit latestMedicalVisit;
    public InsurancePolicy nextExpiringPolicy;
    public long pendingVaccineCount;
    public long medicalVisitCount;
    public long insurancePolicyCount;
    public List<ReminderItem> reminders = new ArrayList<>();
}
