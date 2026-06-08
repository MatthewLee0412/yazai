<script setup>
import { onMounted, reactive } from 'vue'
import { useBabyStore } from '@/stores/baby'
import { useToast } from '@/composables/useToast'
import BabyForm from '@/components/forms/BabyForm.vue'

const babyStore = useBabyStore()
const toast = useToast()

const form = reactive({
  name: '', gender: '', birthDate: '', birthHospital: '',
  birthHeightCm: '', birthWeightKg: '', bloodType: '', allergies: '',
  guardianName: '', guardianPhone: '', notes: ''
})

onMounted(async () => {
  await babyStore.load()
  if (babyStore.baby) {
    Object.keys(form).forEach(key => { form[key] = babyStore.baby[key] ?? '' })
  }
})

async function save() {
  const payload = { ...form }
  Object.keys(payload).forEach(key => {
    if (payload[key] === '') payload[key] = null
    if (['birthHeightCm', 'birthWeightKg'].includes(key) && payload[key] !== null) {
      payload[key] = Number(payload[key])
    }
  })
  if (babyStore.baby?.id) payload.id = babyStore.baby.id
  await babyStore.save(payload)
  toast.show('宝宝档案已保存')
}

function reset() {
  if (babyStore.baby) {
    Object.keys(form).forEach(key => { form[key] = babyStore.baby[key] ?? '' })
  }
}
</script>

<template>
  <div class="view-grid">
    <section class="panel">
      <div class="panel-head">
        <h3>宝宝档案</h3>
        <span class="hint">基础信息</span>
      </div>
      <BabyForm :form="form" @save="save" @reset="reset" />
    </section>
  </div>
</template>
