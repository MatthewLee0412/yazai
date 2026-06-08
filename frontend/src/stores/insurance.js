import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchInsurancePolicies, createInsurancePolicy, updateInsurancePolicy, deleteInsurancePolicy } from '@/api/insurance'

export const useInsuranceStore = defineStore('insurance', () => {
  const records = ref([])

  const sortedByExpiry = computed(() =>
    [...records.value].sort((a, b) => String(a.expiryDate || '').localeCompare(String(b.expiryDate || '')))
  )

  async function load() {
    records.value = await fetchInsurancePolicies()
  }

  async function create(data) {
    await createInsurancePolicy(data)
  }

  async function update(id, data) {
    await updateInsurancePolicy(id, data)
  }

  async function remove(id) {
    await deleteInsurancePolicy(id)
  }

  return { records, sortedByExpiry, load, create, update, remove }
})
