<script setup>
import { useToast } from '@/composables/useToast'

const { visible, message } = useToast()
</script>

<template>
  <div class="toast" :class="{ show: visible }" role="status" aria-live="polite">
    {{ message }}
  </div>
</template>
