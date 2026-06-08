<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useGrowthStore } from '@/stores/growth'
import { formatAge } from '@/utils/format'
import SummaryCard from '@/components/shared/SummaryCard.vue'
import GrowthChart from '@/components/shared/GrowthChart.vue'
import ReminderList from '@/components/shared/ReminderList.vue'

const dashboardStore = useDashboardStore()
const growthStore = useGrowthStore()

const age = computed(() => formatAge(dashboardStore.baby?.birthDate))

const latestGrowthText = computed(() => {
  const g = dashboardStore.latestGrowth
  return g?.heightCm ? `${g.heightCm}cm / ${g.weightKg || '-'}kg` : '暂无'
})

const nextVaccineText = computed(() => {
  const v = dashboardStore.nextVaccine
  return v?.vaccineName ? `${v.vaccineName} ${v.doseLabel || ''}` : '暂无'
})

const nextPolicyText = computed(() => {
  const p = dashboardStore.nextExpiringPolicy
  return p?.policyName ? `${p.policyName} ${p.expiryDate || '-'}` : '暂无'
})

onMounted(async () => {
  await Promise.all([
    dashboardStore.load(),
    growthStore.load()
  ])
})
</script>

<template>
  <div class="view-grid">
    <div class="summary-grid">
      <SummaryCard label="宝宝年龄" :value="age" />
      <SummaryCard label="最新身高/体重" :value="latestGrowthText" />
      <SummaryCard label="下次疫苗" :value="nextVaccineText" />
      <SummaryCard label="保险到期" :value="nextPolicyText" />
    </div>

    <div class="content-grid">
      <section class="panel panel-wide">
        <div class="panel-head">
          <h3>成长趋势</h3>
        </div>
        <GrowthChart :records="growthStore.chartData" />
      </section>

      <section class="panel">
        <div class="panel-head">
          <h3>近期提醒</h3>
        </div>
        <ReminderList :reminders="dashboardStore.reminders" />
      </section>
    </div>
  </div>
</template>
