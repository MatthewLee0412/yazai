import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchMedicalVisits, createMedicalVisit, updateMedicalVisit, deleteMedicalVisit } from '@/api/medical'

export const useMedicalStore = defineStore('medical', () => {
  const records = ref([])

  const sortedByDate = computed(() =>
    [...records.value].sort((a, b) => String(b.visitDate || '').localeCompare(String(a.visitDate || '')))
  )

  async function load() {
    records.value = await fetchMedicalVisits()
  }

  async function create(data) {
    await createMedicalVisit(data)
  }

  async function update(id, data) {
    await updateMedicalVisit(id, data)
  }

  async function remove(id) {
    await deleteMedicalVisit(id)
  }

  return { records, sortedByDate, load, create, update, remove }
})
