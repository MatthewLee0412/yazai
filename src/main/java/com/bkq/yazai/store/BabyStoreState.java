package com.bkq.yazai.store;

import com.bkq.yazai.model.BabyProfile;
import com.bkq.yazai.model.GrowthRecord;
import com.bkq.yazai.model.InsurancePolicy;
import com.bkq.yazai.model.MedicalVisit;
import com.bkq.yazai.model.VaccineRecord;
import com.bkq.yazai.model.VaccineTemplate;

import java.util.ArrayList;
import java.util.List;

public class BabyStoreState {

    public BabyProfile baby = new BabyProfile();
    public List<GrowthRecord> growthRecords = new ArrayList<>();
    public List<MedicalVisit> medicalVisits = new ArrayList<>();
    public List<VaccineTemplate> vaccineTemplates = new ArrayList<>();
    public List<VaccineRecord> vaccineRecords = new ArrayList<>();
    public List<InsurancePolicy> insurancePolicies = new ArrayList<>();
    public long nextGrowthId = 1;
    public long nextMedicalVisitId = 1;
    public long nextVaccineTemplateId = 1;
    public long nextVaccineRecordId = 1;
    public long nextInsurancePolicyId = 1;
}
