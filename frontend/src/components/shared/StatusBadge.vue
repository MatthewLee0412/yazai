<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: '未到期' }
})

const klass = computed(() => {
  const s = props.status || '未到期'
  if (s === '已接种') return 'success'
  if (s.includes('补') || s.includes('延期')) return 'warning'
  if (s.includes('逾期')) return 'danger'
  return ''
})
</script>

<template>
  <span class="status" :class="klass">{{ status || '未到期' }}</span>
</template>
