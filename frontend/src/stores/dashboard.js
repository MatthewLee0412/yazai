import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchDashboard } from '@/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref(null)

  const latestGrowth = computed(() => summary.value?.latestGrowth || {})
  const nextVaccine = computed(() => summary.value?.nextVaccine || {})
  const nextExpiringPolicy = computed(() => summary.value?.nextExpiringPolicy || {})
  const reminders = computed(() => summary.value?.reminders || [])
  const baby = computed(() => summary.value?.baby || {})
  const pendingVaccineCount = computed(() => summary.value?.pendingVaccineCount || 0)
  const medicalVisitCount = computed(() => summary.value?.medicalVisitCount || 0)
  const insurancePolicyCount = computed(() => summary.value?.insurancePolicyCount || 0)

  async function load() {
    summary.value = await fetchDashboard()
  }

  return { summary, latestGrowth, nextVaccine, nextExpiringPolicy, reminders, baby, pendingVaccineCount, medicalVisitCount, insurancePolicyCount, load }
})
