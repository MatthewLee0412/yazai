import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchGrowthRecords, createGrowthRecord, updateGrowthRecord, deleteGrowthRecord } from '@/api/growth'

export const useGrowthStore = defineStore('growth', () => {
  const records = ref([])

  const sortedByDate = computed(() =>
    [...records.value].sort((a, b) => String(b.measuredAt || '').localeCompare(String(a.measuredAt || '')))
  )

  const chartData = computed(() =>
    [...records.value]
      .filter(r => r.measuredAt)
      .sort((a, b) => String(a.measuredAt).localeCompare(String(b.measuredAt)))
  )

  async function load() {
    records.value = await fetchGrowthRecords()
  }

  async function create(data) {
    await createGrowthRecord(data)
  }

  async function update(id, data) {
    await updateGrowthRecord(id, data)
  }

  async function remove(id) {
    await deleteGrowthRecord(id)
  }

  return { records, sortedByDate, chartData, load, create, update, remove }
})
