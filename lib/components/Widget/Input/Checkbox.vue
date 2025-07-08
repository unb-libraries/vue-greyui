<template>
  <input
    ref="input"
    type="checkbox"
    :id="id"
    :name="name"
    v-model="model"
    :value="value"
    :data-state="model === 'indeterminate' ? model : model ? 'checked' : 'unchecked'" />
</template>

<script lang="ts" setup>
import { inject, ref, watch } from 'vue'
import { WidgetInjection } from '~/components'

defineOptions({ name: 'InputCheckbox' })
defineProps<{
  value?: string
}>()

const { value: model, id, name } = inject<WidgetInjection<boolean | 'indeterminate', 'one'>>('widget')
if (!model) {
  throw new Error('Checkbox must be used within a Widget component.')
}

const input = ref<HTMLInputElement>()
watch(() => model.value, (newValue) => {
  if (newValue === 'indeterminate' && input.value) {
    input.value.indeterminate = true
  } else if (input.value) {
    input.value.indeterminate = false
  }
}, { immediate: true })
</script>