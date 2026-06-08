<script setup>
import { VACCINE_STATUS_OPTIONS } from '@/utils/constants'

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  full: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  modelValue: { type: [String, Number], default: '' }
})

const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  const val = event.target.value
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="field" :class="{ full }">
    <label :for="name">{{ label }}</label>

    <textarea
      v-if="type === 'textarea'"
      :id="name"
      :value="modelValue"
      @input="onInput"
    />

    <select
      v-else-if="type === 'select'"
      :id="name"
      :value="modelValue"
      @change="onInput"
    >
      <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <select
      v-else-if="type === 'status'"
      :id="name"
      :value="modelValue"
      @change="onInput"
    >
      <option v-for="opt in VACCINE_STATUS_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
    </select>

    <input
      v-else
      :id="name"
      :type="type"
      :value="modelValue"
      :step="type === 'number' ? '0.01' : undefined"
      @input="onInput"
    />
  </div>
</template>
