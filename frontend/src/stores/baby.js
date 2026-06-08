import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchBaby, updateBaby } from '@/api/baby'

export const useBabyStore = defineStore('baby', () => {
  const baby = ref(null)

  async function load() {
    baby.value = await fetchBaby()
  }

  async function save(data) {
    baby.value = await updateBaby(data)
  }

  return { baby, load, save }
})
