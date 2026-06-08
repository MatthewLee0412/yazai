<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true }
})
</script>

<template>
  <div class="metric">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
  </div>
</template>
