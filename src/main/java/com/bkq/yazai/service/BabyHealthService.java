package com.bkq.yazai.service;

import com.bkq.yazai.model.BabyProfile;
import com.bkq.yazai.model.DashboardSummary;
import com.bkq.yazai.model.GrowthRecord;
import com.bkq.yazai.model.InsurancePolicy;
import com.bkq.yazai.model.MedicalVisit;
import com.bkq.yazai.model.ReminderItem;
import com.bkq.yazai.model.VaccineRecord;
import com.bkq.yazai.model.VaccineTemplate;
import com.bkq.yazai.store.BabyStoreState;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.Period;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class BabyHealthService {

    private final ObjectMapper objectMapper;
    private final Path storageFile;
    private BabyStoreState state = new BabyStoreState();

    public BabyHealthService(
            ObjectMapper objectMapper,
            @Value("${yazai.storage.file:data/yazai-store.json}") String storageFile
    ) {
        this.objectMapper = objectMapper;
        this.storageFile = Path.of(storageFile);
    }

    @PostConstruct
    public synchronized void load() throws IOException {
        if (Files.exists(storageFile)) {
            state = objectMapper.readValue(storageFile.toFile(), BabyStoreState.class);
            repairState();
            return;
        }
        seedState();
        save();
    }

    public synchronized BabyProfile getBaby() {
        return state.baby;
    }

    public synchronized BabyProfile updateBaby(BabyProfile baby) {
        baby.id = 1L;
        state.baby = baby;
        saveUnchecked();
        return state.baby;
    }

    public synchronized List<GrowthRecord> listGrowthRecords() {
        return state.growthRecords.stream()
                .sorted(Comparator.comparing((GrowthRecord item) -> item.measuredAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();
    }

    public synchronized GrowthRecord createGrowthRecord(GrowthRecord record) {
        record.id = state.nextGrowthId++;
        state.growthRecords.add(record);
        saveUnchecked();
        return record;
    }

    public synchronized GrowthRecord updateGrowthRecord(Long id, GrowthRecord record) {
        GrowthRecord existing = findById(state.growthRecords, id);
        record.id = existing.id;
        state.growthRecords.set(state.growthRecords.indexOf(existing), record);
        saveUnchecked();
        return record;
    }

    public synchronized void deleteGrowthRecord(Long id) {
        removeById(state.growthRecords, id);
        saveUnchecked();
    }

    public synchronized List<MedicalVisit> listMedicalVisits() {
        return state.medicalVisits.stream()
                .sorted(Comparator.comparing((MedicalVisit item) -> item.visitDate, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .toList();
    }

    public synchronized MedicalVisit createMedicalVisit(MedicalVisit visit) {
        visit.id = state.nextMedicalVisitId++;
        state.medicalVisits.add(visit);
        saveUnchecked();
        return visit;
    }

    public synchronized MedicalVisit updateMedicalVisit(Long id, MedicalVisit visit) {
        MedicalVisit existing = findById(state.medicalVisits, id);
        visit.id = existing.id;
        state.medicalVisits.set(state.medicalVisits.indexOf(existing), visit);
        saveUnchecked();
        return visit;
    }

    public synchronized void deleteMedicalVisit(Long id) {
        removeById(state.medicalVisits, id);
        saveUnchecked();
    }

    public synchronized List<VaccineTemplate> listVaccineTemplates() {
        return state.vaccineTemplates.stream()
                .sorted(Comparator.comparing(item -> item.sequenceNo, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    public synchronized List<VaccineRecord> listVaccineRecords() {
        return state.vaccineRecords.stream()
                .sorted(Comparator.comparing((VaccineRecord item) -> item.plannedDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    public synchronized VaccineRecord createVaccineRecord(VaccineRecord record) {
        record.id = state.nextVaccineRecordId++;
        state.vaccineRecords.add(record);
        saveUnchecked();
        return record;
    }

    public synchronized VaccineRecord updateVaccineRecord(Long id, VaccineRecord record) {
        VaccineRecord existing = findById(state.vaccineRecords, id);
        record.id = existing.id;
        state.vaccineRecords.set(state.vaccineRecords.indexOf(existing), record);
        saveUnchecked();
        return record;
    }

    public synchronized void deleteVaccineRecord(Long id) {
        removeById(state.vaccineRecords, id);
        saveUnchecked();
    }

    public synchronized List<InsurancePolicy> listInsurancePolicies() {
        return state.insurancePolicies.stream()
                .sorted(Comparator.comparing((InsurancePolicy item) -> item.expiryDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    public synchronized InsurancePolicy createInsurancePolicy(InsurancePolicy policy) {
        policy.id = state.nextInsurancePolicyId++;
        state.insurancePolicies.add(policy);
        saveUnchecked();
        return policy;
    }

    public synchronized InsurancePolicy updateInsurancePolicy(Long id, InsurancePolicy policy) {
        InsurancePolicy existing = findById(state.insurancePolicies, id);
        policy.id = existing.id;
        state.insurancePolicies.set(state.insurancePolicies.indexOf(existing), policy);
        saveUnchecked();
        return policy;
    }

    public synchronized void deleteInsurancePolicy(Long id) {
        removeById(state.insurancePolicies, id);
        saveUnchecked();
    }

    public synchronized DashboardSummary dashboard() {
        DashboardSummary summary = new DashboardSummary();
        LocalDate today = LocalDate.now();
        summary.baby = state.baby;
        summary.latestGrowth = state.growthRecords.stream()
                .filter(item -> item.measuredAt != null)
                .max(Comparator.comparing(item -> item.measuredAt))
                .orElse(null);
        summary.nextVaccine = state.vaccineRecords.stream()
                .filter(item -> !"已接种".equals(item.status) && !"已跳过".equals(item.status))
                .filter(item -> item.plannedDate != null)
                .min(Comparator.comparing(item -> item.plannedDate))
                .orElse(null);
        summary.latestMedicalVisit = state.medicalVisits.stream()
                .filter(item -> item.visitDate != null)
                .max(Comparator.comparing(item -> item.visitDate))
                .orElse(null);
        summary.nextExpiringPolicy = state.insurancePolicies.stream()
                .filter(item -> item.expiryDate != null && !item.expiryDate.isBefore(today))
                .min(Comparator.comparing(item -> item.expiryDate))
                .orElse(null);
        summary.pendingVaccineCount = state.vaccineRecords.stream()
                .filter(item -> !"已接种".equals(item.status) && !"已跳过".equals(item.status))
                .count();
        summary.medicalVisitCount = state.medicalVisits.size();
        summary.insurancePolicyCount = state.insurancePolicies.size();
        summary.reminders = buildReminders(today);
        return summary;
    }

    private List<ReminderItem> buildReminders(LocalDate today) {
        List<ReminderItem> vaccineReminders = state.vaccineRecords.stream()
                .filter(item -> !"已接种".equals(item.status) && !"已跳过".equals(item.status))
                .filter(item -> item.plannedDate != null && !item.plannedDate.isAfter(today.plusDays(30)))
                .map(item -> reminder("疫苗", item.vaccineName + " " + nullToBlank(item.doseLabel), item.plannedDate, dueStatus(today, item.plannedDate)))
                .toList();
        List<ReminderItem> medicalReminders = state.medicalVisits.stream()
                .filter(item -> item.followUpDate != null && !item.followUpDate.isAfter(today.plusDays(30)))
                .map(item -> reminder("复诊", nullToBlank(item.hospital) + " " + nullToBlank(item.department), item.followUpDate, dueStatus(today, item.followUpDate)))
                .toList();
        List<ReminderItem> insuranceReminders = state.insurancePolicies.stream()
                .filter(item -> item.expiryDate != null && !item.expiryDate.isAfter(today.plusDays(60)))
                .map(item -> reminder("保险", item.policyName, item.expiryDate, dueStatus(today, item.expiryDate)))
                .toList();
        return java.util.stream.Stream.of(vaccineReminders, medicalReminders, insuranceReminders)
                .flatMap(List::stream)
                .sorted(Comparator.comparing(item -> item.dueDate, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(8)
                .toList();
    }

    private ReminderItem reminder(String type, String title, LocalDate dueDate, String status) {
        ReminderItem item = new ReminderItem();
        item.type = type;
        item.title = title;
        item.dueDate = dueDate;
        item.status = status;
        return item;
    }

    private String dueStatus(LocalDate today, LocalDate dueDate) {
        if (dueDate.isBefore(today)) {
            return "已逾期";
        }
        if (!dueDate.isAfter(today.plusDays(7))) {
            return "即将到期";
        }
        return "待处理";
    }

    private void repairState() {
        if (state.baby == null) {
            state.baby = defaultBaby();
        }
        state.baby.id = 1L;
        state.nextGrowthId = nextId(state.growthRecords);
        state.nextMedicalVisitId = nextId(state.medicalVisits);
        state.nextVaccineTemplateId = nextId(state.vaccineTemplates);
        state.nextVaccineRecordId = nextId(state.vaccineRecords);
        state.nextInsurancePolicyId = nextId(state.insurancePolicies);
        if (state.vaccineTemplates.isEmpty()) {
            seedVaccines();
        }
    }

    private void seedState() {
        state = new BabyStoreState();
        state.baby = defaultBaby();
        seedGrowthRecords();
        seedVaccines();
        seedVaccineRecords();
        seedMedicalVisits();
        seedInsurancePolicies();
    }

    private BabyProfile defaultBaby() {
        BabyProfile baby = new BabyProfile();
        baby.id = 1L;
        baby.name = "小宝";
        baby.gender = "未填写";
        baby.birthDate = LocalDate.now().minusMonths(2);
        baby.birthHospital = "待填写";
        baby.birthHeightCm = 50.0;
        baby.birthWeightKg = 3.2;
        baby.bloodType = "待填写";
        baby.allergies = "暂无";
        baby.guardianName = "家长";
        baby.guardianPhone = "";
        baby.notes = "第一期 MVP 示例档案，可直接修改。";
        return baby;
    }

    private void seedGrowthRecords() {
        LocalDate birthDate = state.baby.birthDate == null ? LocalDate.now().minusMonths(2) : state.baby.birthDate;
        createSeedGrowth(birthDate, 50.0, 3.2, 34.0, "出生记录");
        createSeedGrowth(birthDate.plusMonths(1), 54.2, 4.3, 36.5, "满月测量");
        createSeedGrowth(birthDate.plusMonths(2), 58.0, 5.1, 38.2, "两月测量");
    }

    private void createSeedGrowth(LocalDate date, Double height, Double weight, Double head, String notes) {
        GrowthRecord record = new GrowthRecord();
        record.id = state.nextGrowthId++;
        record.measuredAt = date;
        record.heightCm = height;
        record.weightKg = weight;
        record.headCircumferenceCm = head;
        record.notes = notes;
        state.growthRecords.add(record);
    }

    private void seedVaccines() {
        vaccine(1, "出生", "乙肝", "1/3", "注射", "/", "是", 0.0, "", "有红肿结疤不要消毒");
        vaccine(2, "出生", "卡介苗", "1/1", "注射", "/", "是", 0.0, "结核病", "");
        vaccine(3, "1月", "乙肝", "2/3", "注射", "/", "是", 0.0, "", "");
        vaccine(4, "2月", "13价肺炎球菌结合疫苗", "1/3", "注射", "/", "否", 726.0, "", "最早1.5月接种，可选国产");
        vaccine(5, "2月", "口服五价轮状病毒", "1/3", "口服", "是", "否", 308.0, "拉肚子", "时间限制严格，吃完记录时间");
        vaccine(6, "2月", "五联", "1/4", "注射", "/", "否", 627.0, "百白破+脊髓灰质+B型流感嗜血杆菌", "建议打，打完记时间");
        vaccine(7, "3月", "13价肺炎球菌结合疫苗", "2/3", "注射", "是", "否", 726.0, "", "和第一针隔28天以上");
        vaccine(8, "3月", "口服五价轮状病毒", "2/3", "口服", "是", "否", 308.0, "", "和第一剂隔4至10周");
        vaccine(9, "3月", "五联", "2/4", "注射", "/", "否", 627.0, "百白破+脊髓灰质+B型流感嗜血杆菌", "和第一针隔28天以上");
        vaccine(10, "3月", "A+C群二价流脑结合", "1/3", "注射", "/", "否", 143.0, "", "");
        vaccine(11, "4月", "13价肺炎球菌结合疫苗", "3/3", "注射", "是", "否", 726.0, "", "和第一针隔28天以上");
        vaccine(12, "4月", "口服五价轮状病毒", "3/3", "口服", "是", "否", 308.0, "", "第三剂必须32周前接种");
        vaccine(13, "4月", "五联", "3/4", "注射", "/", "否", 627.0, "百白破+脊髓灰质+B型流感嗜血杆菌", "和第二针隔28天以上");
        vaccine(14, "4月", "A+C群二价流脑结合", "2/3", "注射", "/", "否", 143.0, "", "");
        vaccine(15, "5月", "A+C群二价流脑结合", "3/3", "注射", "/", "否", 143.0, "", "");
        vaccine(16, "6月", "每年两针流感疫苗", "1/2", "注射", "/", "/", null, "", "");
        vaccine(17, "6月", "乙肝", "3/3", "注射", "/", "是", 0.0, "", "");
        vaccine(18, "6月", "手足口EV71型灭活", "1/2", "注射", "/", "否", 216.0, "", "");
        vaccine(19, "7月", "每年两针流感疫苗", "2/2", "注射", "/", "/", null, "", "");
        vaccine(20, "7月", "手足口EV71型灭活", "2/2", "注射", "/", "否", 216.0, "", "");
        vaccine(21, "8月", "麻腮风", "1/3", "注射", "/", "是", 0.0, "麻疹+风疹+腮腺炎", "");
        vaccine(22, "8月", "乙脑减活毒疫苗", "1/2", "注射", "/", "是", 0.0, "乙型脑炎", "自费灭活疫苗上市时间短，按需选择");
        vaccine(23, "12月", "13价肺炎球菌结合疫苗", "加强针", "注射", "是", "否", 726.0, "", "12月到15月都行");
        vaccine(24, "12月", "水痘", "1/2", "注射", "否", "否", 164.0, "", "第一针时间待确认");
        vaccine(25, "18月", "五联", "4/4", "注射", "/", "否", 627.0, "百白破+脊髓灰质+B型流感嗜血杆菌", "和第三针隔6个月以上");
        vaccine(26, "18月", "流感疫苗", "", "注射", "/", "/", null, "", "");
        vaccine(27, "18月", "麻腮风", "2/3", "注射", "/", "是", 0.0, "麻疹+风疹+腮腺炎", "");
        vaccine(28, "18月", "灭活/减活甲肝", "1/2", "注射", "/", "否", 126.0, "甲肝", "灭活自费，减活免费");
        vaccine(29, "2岁", "灭活/减活甲肝", "2/2", "注射", "/", "否", 126.0, "甲肝", "灭活自费，减活免费");
        vaccine(30, "2岁", "23价肺炎疫苗", "", "注射", "/", "/", null, "", "非必须，肺炎易感人群才打");
        vaccine(31, "2岁", "乙脑减活毒疫苗", "2/2", "注射", "/", "是", 0.0, "乙型脑炎", "自费灭活疫苗上市时间短，按需选择");
        vaccine(32, "2岁6月", "流感疫苗", "", "注射", "/", "/", null, "", "");
        vaccine(33, "3岁", "ACYW135群四价多糖流脑", "1/2", "注射", "/", "否", 87.0, "", "");
        vaccine(34, "3岁6月", "流感疫苗", "", "注射", "/", "/", null, "", "");
        vaccine(35, "4岁", "水痘", "2/2", "注射", "否", "否", 164.0, "", "");
        vaccine(36, "4岁6月", "流感疫苗", "", "注射", "/", "/", null, "", "");
        vaccine(37, "5岁6月", "流感疫苗", "", "注射", "/", "/", null, "", "");
        vaccine(38, "6岁", "ACYW135群四价多糖流脑", "2/2", "注射", "/", "否", 87.0, "", "");
        vaccine(39, "6岁", "白破", "", "注射", "/", "是", 0.0, "", "");
        vaccine(40, "6岁", "麻腮风", "3/3", "注射", "/", "是", 0.0, "麻疹+风疹+腮腺炎", "");
    }

    private void vaccine(int sequenceNo, String ageLabel, String name, String dose, String method, String importedOption,
                         String freeOption, Double referenceCost, String prevents, String notes) {
        VaccineTemplate template = new VaccineTemplate();
        template.id = state.nextVaccineTemplateId++;
        template.sequenceNo = sequenceNo;
        template.ageLabel = ageLabel;
        template.vaccineName = name;
        template.doseLabel = dose;
        template.method = method;
        template.importedOption = importedOption;
        template.freeOption = freeOption;
        template.referenceCost = referenceCost;
        template.prevents = prevents;
        template.notes = notes;
        state.vaccineTemplates.add(template);
    }

    private void seedVaccineRecords() {
        LocalDate birthDate = state.baby.birthDate == null ? LocalDate.now().minusMonths(2) : state.baby.birthDate;
        for (VaccineTemplate template : state.vaccineTemplates) {
            VaccineRecord record = new VaccineRecord();
            record.id = state.nextVaccineRecordId++;
            record.templateId = template.id;
            record.vaccineName = template.vaccineName;
            record.ageLabel = template.ageLabel;
            record.doseLabel = template.doseLabel;
            record.plannedDate = plannedDate(birthDate, template.ageLabel);
            record.status = record.plannedDate != null && record.plannedDate.isBefore(LocalDate.now()) ? "待补种" : "未到期";
            record.notes = template.notes;
            state.vaccineRecords.add(record);
        }
    }

    private LocalDate plannedDate(LocalDate birthDate, String ageLabel) {
        if (ageLabel == null || birthDate == null) {
            return null;
        }
        if ("出生".equals(ageLabel)) {
            return birthDate;
        }
        String normalized = ageLabel.replace("岁", "y").replace("月", "m");
        int years = 0;
        int months = 0;
        if (normalized.contains("y")) {
            years = parseLeadingInt(normalized.substring(0, normalized.indexOf('y')));
            normalized = normalized.substring(normalized.indexOf('y') + 1);
        }
        if (normalized.contains("m")) {
            months = parseLeadingInt(normalized.substring(0, normalized.indexOf('m')));
        }
        if (!ageLabel.contains("岁") && ageLabel.contains("月")) {
            years = 0;
        }
        return birthDate.plus(Period.of(years, months, 0));
    }

    private int parseLeadingInt(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Integer.parseInt(value.replaceAll("[^0-9]", ""));
    }

    private void seedMedicalVisits() {
        MedicalVisit visit = new MedicalVisit();
        visit.id = state.nextMedicalVisitId++;
        visit.visitDate = LocalDate.now().minusDays(12);
        visit.hospital = "社区医院";
        visit.department = "儿保科";
        visit.doctor = "";
        visit.symptoms = "常规体检";
        visit.diagnosis = "生长发育观察";
        visit.medication = "";
        visit.cost = 0.0;
        visit.followUpDate = LocalDate.now().plusMonths(1);
        visit.notes = "示例记录，可修改或删除。";
        state.medicalVisits.add(visit);
    }

    private void seedInsurancePolicies() {
        InsurancePolicy policy = new InsurancePolicy();
        policy.id = state.nextInsurancePolicyId++;
        policy.company = "待填写";
        policy.policyName = "少儿医保";
        policy.policyNo = "";
        policy.coverage = "基础医疗保障";
        policy.effectiveDate = LocalDate.now().minusMonths(1);
        policy.expiryDate = LocalDate.now().plusMonths(11);
        policy.premium = 0.0;
        policy.claimRecords = "";
        policy.notes = "示例保单，可修改或删除。";
        state.insurancePolicies.add(policy);
    }

    private long nextId(List<?> items) {
        long maxId = items.stream()
                .map(this::readId)
                .filter(Objects::nonNull)
                .mapToLong(Long::longValue)
                .max()
                .orElse(0L);
        return maxId + 1;
    }

    private Long readId(Object item) {
        try {
            Object value = item.getClass().getField("id").get(item);
            return value instanceof Long id ? id : null;
        } catch (IllegalAccessException | NoSuchFieldException ex) {
            return null;
        }
    }

    private <T> T findById(List<T> items, Long id) {
        return items.stream()
                .filter(item -> Objects.equals(readId(item), id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("记录不存在: " + id));
    }

    private <T> void removeById(List<T> items, Long id) {
        Optional<T> item = items.stream()
                .filter(candidate -> Objects.equals(readId(candidate), id))
                .findFirst();
        if (item.isEmpty()) {
            throw new IllegalArgumentException("记录不存在: " + id);
        }
        items.remove(item.get());
    }

    private String nullToBlank(String value) {
        return value == null ? "" : value;
    }

    private void saveUnchecked() {
        try {
            save();
        } catch (IOException ex) {
            throw new IllegalStateException("保存数据失败", ex);
        }
    }

    private void save() throws IOException {
        Path parent = storageFile.toAbsolutePath().getParent();
        if (parent != null) {
            Files.createDirectories(parent);
        }
        objectMapper.writerWithDefaultPrettyPrinter().writeValue(storageFile.toFile(), state);
    }
}
