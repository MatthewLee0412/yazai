<script setup>
import { computed, watch } from 'vue'
import FormField from '@/components/shared/FormField.vue'
import FormActions from '@/components/shared/FormActions.vue'
import { VACCINE_FIELDS } from '@/utils/constants'
import { useVaccineStore } from '@/stores/vaccine'

const props = defineProps({
  form: { type: Object, required: true }
})

const emit = defineEmits(['save', 'reset'])
const vaccineStore = useVaccineStore()

const templateOptions = computed(() =>
  vaccineStore.templates.map(t => ({
    value: t.id,
    label: `${t.sequenceNo}. ${t.ageLabel} ${t.vaccineName} ${t.doseLabel || ''}`
  }))
)

function onTemplateChange(id) {
  const template = vaccineStore.templates.find(t => String(t.id) === String(id))
  if (!template) return
  props.form.vaccineName = template.vaccineName || ''
  props.form.ageLabel = template.ageLabel || ''
  props.form.doseLabel = template.doseLabel || ''
  props.form.notes = template.notes || ''
}

const isTemplateField = (field) => field.type === 'template'
const isStatusField = (field) => field.type === 'status'
const isRegularField = (field) => !isTemplateField(field) && !isStatusField(field)
</script>

<template>
  <form class="form-grid" @submit.prevent="$emit('save')">
    <!-- Template selector -->
    <div class="field">
      <label for="templateId">关联计划</label>
      <select id="templateId" :value="form.templateId" @change="form.templateId = $event.target.value; onTemplateChange($event.target.value)">
        <option value="">不关联模板</option>
        <option v-for="opt in templateOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
    </div>

    <!-- Status selector -->
    <div class="field">
      <label for="status">状态</label>
      <select id="status" v-model="form.status">
        <option value="未到期">未到期</option>
        <option value="待接种">待接种</option>
        <option value="待补种">待补种</option>
        <option value="已接种">已接种</option>
        <option value="已延期">已延期</option>
        <option value="已跳过">已跳过</option>
      </select>
    </div>

    <!-- Regular fields (skip templateId and status, already rendered above) -->
    <template v-for="field in VACCINE_FIELDS" :key="field.name">
      <FormField
        v-if="isRegularField(field)"
        :name="field.name"
        :label="field.label"
        :type="field.type"
        :full="field.full"
        :model-value="form[field.name]"
        @update:model-value="form[field.name] = $event"
      />
    </template>
    <FormActions @save="$emit('save')" @reset="$emit('reset')" />
  </form>
</template>
