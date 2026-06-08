<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import EmptyState from './EmptyState.vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  records: { type: Array, default: () => [] }
})

const chartData = computed(() => {
  const sorted = [...props.records]
    .filter(r => r.measuredAt)
    .sort((a, b) => String(a.measuredAt).localeCompare(String(b.measuredAt)))
  return {
    labels: sorted.map(r => String(r.measuredAt).slice(5)),
    datasets: [
      {
        label: '身高(cm)',
        data: sorted.map(r => r.heightCm),
        borderColor: '#0891b2',
        backgroundColor: 'rgba(8,145,178,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        yAxisID: 'yHeight'
      },
      {
        label: '体重(kg)',
        data: sorted.map(r => r.weightKg),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        yAxisID: 'yWeight'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { position: 'top' }
  },
  scales: {
    yHeight: {
      type: 'linear',
      position: 'left',
      title: { display: true, text: '身高(cm)' }
    },
    yWeight: {
      type: 'linear',
      position: 'right',
      title: { display: true, text: '体重(kg)' },
      grid: { drawOnChartArea: false }
    }
  }
}
</script>

<template>
  <div class="chart-wrap">
    <Line v-if="records.length >= 2" :data="chartData" :options="chartOptions" />
    <EmptyState v-else message="至少录入两条成长记录后显示曲线" />
  </div>
</template>
