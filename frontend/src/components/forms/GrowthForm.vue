<script setup>
import FormField from '@/components/shared/FormField.vue'
import FormActions from '@/components/shared/FormActions.vue'
import { GROWTH_FIELDS } from '@/utils/constants'

const props = defineProps({
  form: { type: Object, required: true }
})

const emit = defineEmits(['save', 'reset'])
</script>

<template>
  <form class="form-grid" @submit.prevent="$emit('save')">
    <template v-for="field in GROWTH_FIELDS" :key="field.name">
      <FormField
        :name="field.name"
        :label="field.label"
        :type="field.type"
        :full="field.full"
        :model-value="form[field.name]"
        @update:model-value="form[field.name] = $event"
      />
    </template>
    <FormActions @save="$emit('save')" @reset="$emit('reset')" />
  </form>
</template>
