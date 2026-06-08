import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchVaccineTemplates, fetchVaccineRecords, createVaccineRecord, updateVaccineRecord, deleteVaccineRecord } from '@/api/vaccine'

export const useVaccineStore = defineStore('vaccine', () => {
  const records = ref([])
  const templates = ref([])

  const sortedRecords = computed(() =>
    [...records.value].sort((a, b) => String(a.plannedDate || '').localeCompare(String(b.plannedDate || '')))
  )

  const pendingCount = computed(() =>
    records.value.filter(r => !['已接种', '已跳过'].includes(r.status)).length
  )

  async function loadRecords() {
    records.value = await fetchVaccineRecords()
  }

  async function loadTemplates() {
    templates.value = await fetchVaccineTemplates()
  }

  async function create(data) {
    await createVaccineRecord(data)
  }

  async function update(id, data) {
    await updateVaccineRecord(id, data)
  }

  async function remove(id) {
    await deleteVaccineRecord(id)
  }

  return { records, templates, sortedRecords, pendingCount, loadRecords, loadTemplates, create, update, remove }
})
