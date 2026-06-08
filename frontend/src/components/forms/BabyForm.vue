<script setup>
import FormField from '@/components/shared/FormField.vue'
import FormActions from '@/components/shared/FormActions.vue'
import { BABY_FIELDS } from '@/utils/constants'

const props = defineProps({
  form: { type: Object, required: true }
})

const emit = defineEmits(['save', 'reset'])
</script>

<template>
  <form class="form-grid" @submit.prevent="$emit('save')">
    <template v-for="field in BABY_FIELDS" :key="field.name">
      <FormField
        :name="field.name"
        :label="field.label"
        :type="field.type"
        :full="field.full"
        :options="field.options"
        :model-value="form[field.name]"
        @update:model-value="form[field.name] = $event"
      />
    </template>
    <FormActions @save="$emit('save')" @reset="$emit('reset')" />
  </form>
</template>
