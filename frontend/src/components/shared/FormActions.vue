<script setup>
defineProps({
  showDelete: { type: Boolean, default: false }
})

const emit = defineEmits(['save', 'reset', 'delete'])
</script>

<template>
  <div class="form-actions">
    <button type="submit" class="primary-btn" @click.prevent="$emit('save')">保存</button>
    <button type="button" class="ghost-btn" @click="$emit('reset')">清空</button>
    <button v-if="showDelete" type="button" class="danger-btn" @click="$emit('delete')">删除</button>
  </div>
</template>
