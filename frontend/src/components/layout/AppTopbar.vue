<script setup>
import { useDashboardStore } from '@/stores/dashboard'
import { useGrowthStore } from '@/stores/growth'
import { useMedicalStore } from '@/stores/medical'
import { useVaccineStore } from '@/stores/vaccine'
import { useInsuranceStore } from '@/stores/insurance'
import { useBabyStore } from '@/stores/baby'
import { useToast } from '@/composables/useToast'

defineProps({ title: { type: String, required: true } })

const toast = useToast()
const dashboardStore = useDashboardStore()
const growthStore = useGrowthStore()
const medicalStore = useMedicalStore()
const vaccineStore = useVaccineStore()
const insuranceStore = useInsuranceStore()
const babyStore = useBabyStore()

async function refreshAll() {
  await Promise.all([
    dashboardStore.load(),
    babyStore.load(),
    growthStore.load(),
    medicalStore.load(),
    vaccineStore.loadRecords(),
    vaccineStore.loadTemplates(),
    insuranceStore.load()
  ])
  toast.show('数据已刷新')
}
</script>

<template>
  <header class="topbar">
    <div>
      <p class="eyebrow">MVP v1 · Vue</p>
      <h2>{{ title }}</h2>
    </div>
    <button class="primary-btn" @click="refreshAll">刷新数据</button>
  </header>
</template>
