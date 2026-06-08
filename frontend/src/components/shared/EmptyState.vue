<script setup>
defineProps({
  message: { type: String, default: '暂无记录' }
})
</script>

<template>
  <div class="empty">{{ message }}</div>
</template>
