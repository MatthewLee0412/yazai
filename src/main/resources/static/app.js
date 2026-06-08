const api = {
    dashboard: "/api/dashboard",
    baby: "/api/baby",
    growth: "/api/growth-records",
    medical: "/api/medical-visits",
    vaccineTemplates: "/api/vaccine-templates",
    vaccineRecords: "/api/vaccine-records",
    insurance: "/api/insurance-policies"
};

const state = {
    dashboard: null,
    baby: null,
    growth: [],
    medical: [],
    vaccineTemplates: [],
    vaccineRecords: [],
    insurance: []
};

const titles = {
    dashboard: "总览",
    profile: "宝宝档案",
    growth: "成长记录",
    vaccine: "疫苗管理",
    medical: "就医记录",
    insurance: "保险管理"
};

const fieldSets = {
    baby: [
        ["name", "姓名"], ["gender", "性别"], ["birthDate", "出生日期", "date"], ["birthHospital", "出生医院"],
        ["birthHeightCm", "出生身高(cm)", "number"], ["birthWeightKg", "出生体重(kg)", "number"], ["bloodType", "血型"], ["allergies", "过敏史"],
        ["guardianName", "监护人"], ["guardianPhone", "联系电话"], ["notes", "备注", "textarea", "full"]
    ],
    growth: [
        ["measuredAt", "测量日期", "date"], ["heightCm", "身高(cm)", "number"], ["weightKg", "体重(kg)", "number"], ["headCircumferenceCm", "头围(cm)", "number"],
        ["notes", "备注", "textarea", "full"]
    ],
    medical: [
        ["visitDate", "就医日期", "date"], ["hospital", "医院"], ["department", "科室"], ["doctor", "医生"],
        ["symptoms", "症状", "textarea", "full"], ["diagnosis", "诊断", "textarea", "full"], ["medication", "用药", "textarea", "full"],
        ["cost", "费用", "number"], ["followUpDate", "复诊日期", "date"], ["notes", "备注", "textarea", "full"]
    ],
    vaccine: [
        ["templateId", "关联计划", "template"], ["vaccineName", "疫苗名称"], ["ageLabel", "月龄"], ["doseLabel", "针次"],
        ["plannedDate", "计划日期", "date"], ["vaccinatedDate", "接种日期", "date"], ["status", "状态", "status"], ["location", "接种地点"],
        ["batchNo", "批号"], ["doctor", "医生"], ["notes", "备注", "textarea", "full"]
    ],
    insurance: [
        ["company", "保险公司"], ["policyName", "保险名称"], ["policyNo", "保单号"], ["premium", "保费", "number"],
        ["effectiveDate", "生效日期", "date"], ["expiryDate", "到期日期", "date"], ["coverage", "保障范围", "textarea", "full"],
        ["claimRecords", "理赔记录", "textarea", "full"], ["notes", "备注", "textarea", "full"]
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    bindNavigation();
    bindForms();
    document.getElementById("refreshBtn").addEventListener("click", () => loadAll(true));
    loadAll();
});

function bindNavigation() {
    document.querySelectorAll(".nav-item").forEach((button) => {
        button.addEventListener("click", () => {
            const view = button.dataset.view;
            document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item === button));
            document.querySelectorAll(".view").forEach((item) => item.classList.toggle("is-active", item.id === `${view}View`));
            document.getElementById("pageTitle").textContent = titles[view];
        });
    });
}

function bindForms() {
    renderForm("babyForm", fieldSets.baby, saveBaby);
    renderForm("growthForm", fieldSets.growth, (payload, id) => saveCollection(api.growth, payload, id));
    renderForm("medicalForm", fieldSets.medical, (payload, id) => saveCollection(api.medical, payload, id));
    renderForm("vaccineForm", fieldSets.vaccine, (payload, id) => saveCollection(api.vaccineRecords, payload, id));
    renderForm("insuranceForm", fieldSets.insurance, (payload, id) => saveCollection(api.insurance, payload, id));
    document.querySelectorAll("[data-reset-form]").forEach((button) => {
        button.addEventListener("click", () => resetForm(button.dataset.resetForm));
    });
}

function renderForm(formId, fields, onSubmit) {
    const form = document.getElementById(formId);
    form.innerHTML = fields.map(([name, label, type = "text", width = ""]) => fieldHtml(name, label, type, width)).join("")
        + `<div class="form-actions"><button class="primary-btn" type="submit">保存</button><button class="ghost-btn" type="button" data-clear>清空</button><input type="hidden" name="id"></div>`;
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const payload = readForm(form);
        const id = payload.id;
        delete payload.id;
        await onSubmit(payload, id);
        resetForm(formId);
        await loadAll(true);
    });
    form.querySelector("[data-clear]").addEventListener("click", () => resetForm(formId));
}

function fieldHtml(name, label, type, width) {
    const full = width === "full" ? " full" : "";
    if (type === "textarea") {
        return `<div class="field${full}"><label for="${name}">${label}</label><textarea id="${name}" name="${name}"></textarea></div>`;
    }
    if (type === "status") {
        return `<div class="field${full}"><label for="${name}">${label}</label><select id="${name}" name="${name}">
            <option value="未到期">未到期</option><option value="待接种">待接种</option><option value="待补种">待补种</option>
            <option value="已接种">已接种</option><option value="已延期">已延期</option><option value="已跳过">已跳过</option>
        </select></div>`;
    }
    if (type === "template") {
        return `<div class="field${full}"><label for="${name}">${label}</label><select id="${name}" name="${name}"></select></div>`;
    }
    const step = type === "number" ? ` step="0.01"` : "";
    return `<div class="field${full}"><label for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}"${step}></div>`;
}

async function loadAll(showMessage = false) {
    const [dashboard, baby, growth, medical, vaccineTemplates, vaccineRecords, insurance] = await Promise.all([
        request(api.dashboard),
        request(api.baby),
        request(api.growth),
        request(api.medical),
        request(api.vaccineTemplates),
        request(api.vaccineRecords),
        request(api.insurance)
    ]);
    Object.assign(state, { dashboard, baby, growth, medical, vaccineTemplates, vaccineRecords, insurance });
    renderAll();
    if (showMessage) {
        toast("数据已刷新");
    }
}

function renderAll() {
    populateBabyForm();
    populateTemplateOptions();
    renderDashboard();
    renderGrowthTable();
    renderVaccineTables();
    renderMedicalTable();
    renderInsuranceTable();
}

function populateBabyForm() {
    fillForm("babyForm", state.baby || {});
}

function populateTemplateOptions() {
    const select = document.querySelector("#vaccineForm [name='templateId']");
    if (!select) return;
    select.innerHTML = `<option value="">不关联模板</option>` + state.vaccineTemplates.map((item) => {
        const text = `${item.sequenceNo}. ${item.ageLabel} ${item.vaccineName} ${item.doseLabel || ""}`;
        return `<option value="${item.id}">${escapeHtml(text)}</option>`;
    }).join("");
    select.onchange = () => {
        const template = state.vaccineTemplates.find((item) => String(item.id) === select.value);
        if (!template) return;
        const form = document.getElementById("vaccineForm");
        form.vaccineName.value = template.vaccineName || "";
        form.ageLabel.value = template.ageLabel || "";
        form.doseLabel.value = template.doseLabel || "";
        form.notes.value = template.notes || "";
    };
}

function renderDashboard() {
    const summary = state.dashboard || {};
    const baby = summary.baby || {};
    const latestGrowth = summary.latestGrowth || {};
    const nextVaccine = summary.nextVaccine || {};
    const nextPolicy = summary.nextExpiringPolicy || {};
    const age = baby.birthDate ? formatAge(baby.birthDate) : "待填写";
    document.getElementById("summaryGrid").innerHTML = [
        metric("宝宝年龄", age),
        metric("最新身高/体重", latestGrowth.heightCm ? `${latestGrowth.heightCm}cm / ${latestGrowth.weightKg || "-"}kg` : "暂无"),
        metric("下次疫苗", nextVaccine.vaccineName ? `${nextVaccine.vaccineName} ${nextVaccine.doseLabel || ""}` : "暂无"),
        metric("保险到期", nextPolicy.policyName ? `${nextPolicy.policyName} ${formatDate(nextPolicy.expiryDate)}` : "暂无")
    ].join("");
    renderGrowthChart();
    const reminders = summary.reminders || [];
    document.getElementById("reminderList").innerHTML = reminders.length ? reminders.map((item) => `
        <div class="reminder-item">
            <strong>${escapeHtml(item.type)} · ${escapeHtml(item.title || "")}</strong>
            <span>${formatDate(item.dueDate)} · ${escapeHtml(item.status || "")}</span>
        </div>
    `).join("") : `<div class="empty">暂无近期提醒</div>`;
}

function metric(label, value) {
    return `<div class="metric"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>`;
}

function renderGrowthTable() {
    const rows = state.growth.map((item) => `
        <tr>
            <td>${formatDate(item.measuredAt)}</td><td>${empty(item.heightCm)}</td><td>${empty(item.weightKg)}</td><td>${empty(item.headCircumferenceCm)}</td>
            <td>${escapeHtml(item.notes || "")}</td><td>${rowActions("growth", item.id)}</td>
        </tr>
    `).join("");
    document.getElementById("growthTable").innerHTML = table(["日期", "身高(cm)", "体重(kg)", "头围(cm)", "备注", "操作"], rows);
}

function renderVaccineTables() {
    const recordRows = state.vaccineRecords.map((item) => `
        <tr>
            <td>${formatDate(item.plannedDate)}</td><td>${escapeHtml(item.ageLabel || "")}</td><td>${escapeHtml(item.vaccineName || "")}</td>
            <td>${escapeHtml(item.doseLabel || "")}</td><td>${statusBadge(item.status)}</td><td>${formatDate(item.vaccinatedDate)}</td>
            <td>${escapeHtml(item.location || "")}</td><td>${escapeHtml(item.notes || "")}</td><td>${rowActions("vaccine", item.id)}</td>
        </tr>
    `).join("");
    document.getElementById("vaccineRecordTable").innerHTML = table(["计划日期", "年龄", "疫苗", "针次", "状态", "接种日期", "地点", "备注", "操作"], recordRows);

    const templateRows = state.vaccineTemplates.map((item) => `
        <tr>
            <td>${item.sequenceNo}</td><td>${escapeHtml(item.ageLabel || "")}</td><td>${escapeHtml(item.vaccineName || "")}</td>
            <td>${escapeHtml(item.doseLabel || "")}</td><td>${escapeHtml(item.method || "")}</td><td>${escapeHtml(item.importedOption || "")}</td>
            <td>${escapeHtml(item.freeOption || "")}</td><td>${item.referenceCost ?? "/"}</td><td>${escapeHtml(item.prevents || "")}</td><td>${escapeHtml(item.notes || "")}</td>
        </tr>
    `).join("");
    document.getElementById("vaccineTemplateTable").innerHTML = table(["序号", "年龄", "疫苗名称", "针次", "方式", "进口", "免费", "参考费用", "预防", "注意事项"], templateRows);
}

function renderMedicalTable() {
    const rows = state.medical.map((item) => `
        <tr>
            <td>${formatDate(item.visitDate)}</td><td>${escapeHtml(item.hospital || "")}</td><td>${escapeHtml(item.department || "")}</td>
            <td>${escapeHtml(item.symptoms || "")}</td><td>${escapeHtml(item.diagnosis || "")}</td><td>${escapeHtml(item.medication || "")}</td>
            <td>${empty(item.cost)}</td><td>${formatDate(item.followUpDate)}</td><td>${rowActions("medical", item.id)}</td>
        </tr>
    `).join("");
    document.getElementById("medicalTable").innerHTML = table(["日期", "医院", "科室", "症状", "诊断", "用药", "费用", "复诊", "操作"], rows);
}

function renderInsuranceTable() {
    const rows = state.insurance.map((item) => `
        <tr>
            <td>${escapeHtml(item.company || "")}</td><td>${escapeHtml(item.policyName || "")}</td><td>${escapeHtml(item.policyNo || "")}</td>
            <td>${formatDate(item.effectiveDate)}</td><td>${formatDate(item.expiryDate)}</td><td>${empty(item.premium)}</td>
            <td>${escapeHtml(item.coverage || "")}</td><td>${rowActions("insurance", item.id)}</td>
        </tr>
    `).join("");
    document.getElementById("insuranceTable").innerHTML = table(["公司", "保险名称", "保单号", "生效", "到期", "保费", "保障范围", "操作"], rows);
}

function table(headers, rows) {
    if (!rows) {
        return `<div class="empty">暂无记录</div>`;
    }
    return `<table><thead><tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr></thead><tbody>${rows}</tbody></table>`;
}

function rowActions(type, id) {
    return `<button class="text-btn" onclick="editItem('${type}', ${id})">编辑</button><button class="danger-btn" onclick="deleteItem('${type}', ${id})">删除</button>`;
}

function statusBadge(status) {
    const value = status || "未到期";
    const klass = value === "已接种" ? "success" : value.includes("补") || value.includes("延期") ? "warning" : value.includes("逾期") ? "danger" : "";
    return `<span class="status ${klass}">${escapeHtml(value)}</span>`;
}

function renderGrowthChart() {
    const svg = document.getElementById("growthChart");
    const rows = [...state.growth].filter((item) => item.measuredAt).sort((a, b) => String(a.measuredAt).localeCompare(String(b.measuredAt)));
    if (rows.length < 2) {
        svg.innerHTML = `<text x="24" y="48" fill="#5b7773">至少录入两条成长记录后显示曲线</text>`;
        return;
    }
    const width = svg.clientWidth || 760;
    const height = svg.clientHeight || 280;
    const pad = { left: 46, right: 24, top: 28, bottom: 42 };
    const points = rows.map((item, index) => ({ x: index, height: Number(item.heightCm || 0), weight: Number(item.weightKg || 0), label: item.measuredAt }));
    const heightValues = points.map((item) => item.height).filter(Boolean);
    const weightValues = points.map((item) => item.weight).filter(Boolean);
    const minH = Math.min(...heightValues) - 2;
    const maxH = Math.max(...heightValues) + 2;
    const minW = Math.min(...weightValues) - 0.5;
    const maxW = Math.max(...weightValues) + 0.5;
    const x = (index) => pad.left + (index / Math.max(points.length - 1, 1)) * (width - pad.left - pad.right);
    const yH = (value) => height - pad.bottom - ((value - minH) / Math.max(maxH - minH, 1)) * (height - pad.top - pad.bottom);
    const yW = (value) => height - pad.bottom - ((value - minW) / Math.max(maxW - minW, 1)) * (height - pad.top - pad.bottom);
    const lineH = points.map((item, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${yH(item.height)}`).join(" ");
    const lineW = points.map((item, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${yW(item.weight)}`).join(" ");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = `
        <line x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}" stroke="#cfe7e2"/>
        <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${height - pad.bottom}" stroke="#cfe7e2"/>
        <path d="${lineH}" fill="none" stroke="#0891b2" stroke-width="3"/>
        <path d="${lineW}" fill="none" stroke="#22c55e" stroke-width="3"/>
        ${points.map((item, index) => `<circle cx="${x(index)}" cy="${yH(item.height)}" r="4" fill="#0891b2"/><circle cx="${x(index)}" cy="${yW(item.weight)}" r="4" fill="#22c55e"/>`).join("")}
        <text x="${pad.left}" y="18" fill="#0891b2">身高(cm)</text>
        <text x="${pad.left + 96}" y="18" fill="#15803d">体重(kg)</text>
        ${points.map((item, index) => `<text x="${x(index) - 26}" y="${height - 14}" fill="#5b7773" font-size="12">${formatDate(item.label).slice(5)}</text>`).join("")}
    `;
}

async function saveBaby(payload) {
    await request(api.baby, { method: "PUT", body: payload });
    toast("宝宝档案已保存");
}

async function saveCollection(url, payload, id) {
    const endpoint = id ? `${url}/${id}` : url;
    await request(endpoint, { method: id ? "PUT" : "POST", body: payload });
    toast("记录已保存");
}

async function deleteItem(type, id) {
    const map = { growth: api.growth, medical: api.medical, vaccine: api.vaccineRecords, insurance: api.insurance };
    if (!window.confirm("确认删除这条记录吗？")) return;
    await request(`${map[type]}/${id}`, { method: "DELETE" });
    await loadAll(true);
}

function editItem(type, id) {
    const config = {
        growth: ["growthForm", state.growth],
        medical: ["medicalForm", state.medical],
        vaccine: ["vaccineForm", state.vaccineRecords],
        insurance: ["insuranceForm", state.insurance]
    }[type];
    const item = config[1].find((row) => row.id === id);
    if (!item) return;
    fillForm(config[0], item);
    toast("已载入编辑");
}

function readForm(form) {
    return Object.fromEntries([...new FormData(form).entries()].map(([key, value]) => {
        if (value === "") return [key, null];
        const input = form.elements[key];
        if (input && input.type === "number") return [key, Number(value)];
        if (["id", "templateId"].includes(key)) return [key, value ? Number(value) : null];
        return [key, value];
    }));
}

function fillForm(formId, data) {
    const form = document.getElementById(formId);
    Object.keys(form.elements).forEach((key) => {
        if (!form.elements[key] || key === "length") return;
        form.elements[key].value = data[key] ?? "";
    });
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    form.reset();
    if (form.elements.id) form.elements.id.value = "";
}

async function request(url, options = {}) {
    const init = { method: options.method || "GET", headers: {} };
    if (options.body !== undefined) {
        init.headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(options.body);
    }
    const response = await fetch(url, init);
    if (!response.ok) {
        let message = "请求失败";
        try {
            const error = await response.json();
            message = error.message || message;
        } catch (ignored) {
            message = `${message}: ${response.status}`;
        }
        toast(message);
        throw new Error(message);
    }
    if (response.status === 204) {
        return null;
    }
    return response.json();
}

function formatAge(birthDate) {
    const start = new Date(birthDate);
    const now = new Date();
    let months = (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth();
    if (now.getDate() < start.getDate()) months -= 1;
    if (months < 12) return `${Math.max(months, 0)}月龄`;
    const years = Math.floor(months / 12);
    const leftMonths = months % 12;
    return leftMonths ? `${years}岁${leftMonths}月` : `${years}岁`;
}

function formatDate(value) {
    return value || "-";
}

function empty(value) {
    return value === null || value === undefined || value === "" ? "-" : escapeHtml(String(value));
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => el.classList.remove("show"), 2200);
}
