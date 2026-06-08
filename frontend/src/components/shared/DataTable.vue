<script setup>
import EmptyState from './EmptyState.vue'

defineProps({
  headers: { type: Array, required: true }
})

const slots = defineSlots()
</script>

<template>
  <div class="table-wrap">
    <table v-if="!!slots.default">
      <thead>
        <tr>
          <th v-for="h in headers" :key="h">{{ h }}</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
    <EmptyState v-else />
  </div>
</template>
