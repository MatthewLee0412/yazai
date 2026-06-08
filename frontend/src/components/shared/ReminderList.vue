<script setup>
import { formatDate } from '@/utils/format'
import EmptyState from './EmptyState.vue'

defineProps({
  reminders: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="reminder-list">
    <template v-if="reminders.length">
      <div v-for="(item, i) in reminders" :key="i" class="reminder-item">
        <strong>{{ item.type }} · {{ item.title || '' }}</strong>
        <span>{{ formatDate(item.dueDate) }} · {{ item.status || '' }}</span>
      </div>
    </template>
    <EmptyState v-else message="暂无近期提醒" />
  </div>
</template>
