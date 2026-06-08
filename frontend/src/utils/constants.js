export const NAV_ITEMS = [
  { name: 'dashboard', label: '总览', path: '/' },
  { name: 'profile', label: '宝宝档案', path: '/profile' },
  { name: 'growth', label: '成长记录', path: '/growth' },
  { name: 'vaccine', label: '疫苗管理', path: '/vaccine' },
  { name: 'medical', label: '就医记录', path: '/medical' },
  { name: 'insurance', label: '保险管理', path: '/insurance' }
]

export const VACCINE_STATUS_OPTIONS = ['未到期', '待接种', '待补种', '已接种', '已延期', '已跳过']

export const GENDER_OPTIONS = ['男', '女', '未填写']

export const BLOOD_TYPE_OPTIONS = ['A', 'B', 'AB', 'O', '待填写']

export const BABY_FIELDS = [
  { name: 'name', label: '姓名', type: 'text' },
  { name: 'gender', label: '性别', type: 'select', options: GENDER_OPTIONS },
  { name: 'birthDate', label: '出生日期', type: 'date' },
  { name: 'birthHospital', label: '出生医院', type: 'text' },
  { name: 'birthHeightCm', label: '出生身高(cm)', type: 'number' },
  { name: 'birthWeightKg', label: '出生体重(kg)', type: 'number' },
  { name: 'bloodType', label: '血型', type: 'select', options: BLOOD_TYPE_OPTIONS },
  { name: 'allergies', label: '过敏史', type: 'text' },
  { name: 'guardianName', label: '监护人', type: 'text' },
  { name: 'guardianPhone', label: '联系电话', type: 'text' },
  { name: 'notes', label: '备注', type: 'textarea', full: true }
]

export const GROWTH_FIELDS = [
  { name: 'measuredAt', label: '测量日期', type: 'date' },
  { name: 'heightCm', label: '身高(cm)', type: 'number' },
  { name: 'weightKg', label: '体重(kg)', type: 'number' },
  { name: 'headCircumferenceCm', label: '头围(cm)', type: 'number' },
  { name: 'notes', label: '备注', type: 'textarea', full: true }
]

export const MEDICAL_FIELDS = [
  { name: 'visitDate', label: '就医日期', type: 'date' },
  { name: 'hospital', label: '医院', type: 'text' },
  { name: 'department', label: '科室', type: 'text' },
  { name: 'doctor', label: '医生', type: 'text' },
  { name: 'symptoms', label: '症状', type: 'textarea', full: true },
  { name: 'diagnosis', label: '诊断', type: 'textarea', full: true },
  { name: 'medication', label: '用药', type: 'textarea', full: true },
  { name: 'cost', label: '费用', type: 'number' },
  { name: 'followUpDate', label: '复诊日期', type: 'date' },
  { name: 'notes', label: '备注', type: 'textarea', full: true }
]

export const VACCINE_FIELDS = [
  { name: 'templateId', label: '关联计划', type: 'template' },
  { name: 'vaccineName', label: '疫苗名称', type: 'text' },
  { name: 'ageLabel', label: '月龄', type: 'text' },
  { name: 'doseLabel', label: '针次', type: 'text' },
  { name: 'plannedDate', label: '计划日期', type: 'date' },
  { name: 'vaccinatedDate', label: '接种日期', type: 'date' },
  { name: 'status', label: '状态', type: 'status' },
  { name: 'location', label: '接种地点', type: 'text' },
  { name: 'batchNo', label: '批号', type: 'text' },
  { name: 'doctor', label: '医生', type: 'text' },
  { name: 'notes', label: '备注', type: 'textarea', full: true }
]

export const INSURANCE_FIELDS = [
  { name: 'company', label: '保险公司', type: 'text' },
  { name: 'policyName', label: '保险名称', type: 'text' },
  { name: 'policyNo', label: '保单号', type: 'text' },
  { name: 'premium', label: '保费', type: 'number' },
  { name: 'effectiveDate', label: '生效日期', type: 'date' },
  { name: 'expiryDate', label: '到期日期', type: 'date' },
  { name: 'coverage', label: '保障范围', type: 'textarea', full: true },
  { name: 'claimRecords', label: '理赔记录', type: 'textarea', full: true },
  { name: 'notes', label: '备注', type: 'textarea', full: true }
]
