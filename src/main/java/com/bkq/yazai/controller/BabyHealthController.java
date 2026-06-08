package com.bkq.yazai.controller;

import com.bkq.yazai.model.BabyProfile;
import com.bkq.yazai.model.DashboardSummary;
import com.bkq.yazai.model.GrowthRecord;
import com.bkq.yazai.model.InsurancePolicy;
import com.bkq.yazai.model.MedicalVisit;
import com.bkq.yazai.model.VaccineRecord;
import com.bkq.yazai.model.VaccineTemplate;
import com.bkq.yazai.service.BabyHealthService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BabyHealthController {

    private final BabyHealthService service;

    public BabyHealthController(BabyHealthService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public DashboardSummary dashboard() {
        return service.dashboard();
    }

    @GetMapping("/baby")
    public BabyProfile getBaby() {
        return service.getBaby();
    }

    @PutMapping("/baby")
    public BabyProfile updateBaby(@RequestBody BabyProfile baby) {
        return service.updateBaby(baby);
    }

    @GetMapping("/growth-records")
    public List<GrowthRecord> listGrowthRecords() {
        return service.listGrowthRecords();
    }

    @PostMapping("/growth-records")
    public GrowthRecord createGrowthRecord(@RequestBody GrowthRecord record) {
        return service.createGrowthRecord(record);
    }

    @PutMapping("/growth-records/{id}")
    public GrowthRecord updateGrowthRecord(@PathVariable Long id, @RequestBody GrowthRecord record) {
        return service.updateGrowthRecord(id, record);
    }

    @DeleteMapping("/growth-records/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGrowthRecord(@PathVariable Long id) {
        service.deleteGrowthRecord(id);
    }

    @GetMapping("/medical-visits")
    public List<MedicalVisit> listMedicalVisits() {
        return service.listMedicalVisits();
    }

    @PostMapping("/medical-visits")
    public MedicalVisit createMedicalVisit(@RequestBody MedicalVisit visit) {
        return service.createMedicalVisit(visit);
    }

    @PutMapping("/medical-visits/{id}")
    public MedicalVisit updateMedicalVisit(@PathVariable Long id, @RequestBody MedicalVisit visit) {
        return service.updateMedicalVisit(id, visit);
    }

    @DeleteMapping("/medical-visits/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedicalVisit(@PathVariable Long id) {
        service.deleteMedicalVisit(id);
    }

    @GetMapping("/vaccine-templates")
    public List<VaccineTemplate> listVaccineTemplates() {
        return service.listVaccineTemplates();
    }

    @GetMapping("/vaccine-records")
    public List<VaccineRecord> listVaccineRecords() {
        return service.listVaccineRecords();
    }

    @PostMapping("/vaccine-records")
    public VaccineRecord createVaccineRecord(@RequestBody VaccineRecord record) {
        return service.createVaccineRecord(record);
    }

    @PutMapping("/vaccine-records/{id}")
    public VaccineRecord updateVaccineRecord(@PathVariable Long id, @RequestBody VaccineRecord record) {
        return service.updateVaccineRecord(id, record);
    }

    @DeleteMapping("/vaccine-records/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteVaccineRecord(@PathVariable Long id) {
        service.deleteVaccineRecord(id);
    }

    @GetMapping("/insurance-policies")
    public List<InsurancePolicy> listInsurancePolicies() {
        return service.listInsurancePolicies();
    }

    @PostMapping("/insurance-policies")
    public InsurancePolicy createInsurancePolicy(@RequestBody InsurancePolicy policy) {
        return service.createInsurancePolicy(policy);
    }

    @PutMapping("/insurance-policies/{id}")
    public InsurancePolicy updateInsurancePolicy(@PathVariable Long id, @RequestBody InsurancePolicy policy) {
        return service.updateInsurancePolicy(id, policy);
    }

    @DeleteMapping("/insurance-policies/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInsurancePolicy(@PathVariable Long id) {
        service.deleteInsurancePolicy(id);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleBadRequest(RuntimeException ex) {
        return Map.of("message", ex.getMessage());
    }
}
