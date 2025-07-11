<template>
  <input
    ref="input"
    type="checkbox"
    v-model="model"
    :id="id"
    :name="name"
    :value="value"
    :data-state="state" />
</template>

<script lang="ts" setup generic="T">
import { computed, inject, ref, watch } from 'vue'
import type { Cardinality, WidgetInjection } from '~/components'

defineOptions({ name: 'InputCheckbox' })
defineProps<{
  value?: T
}>()

const { value: model, id, name } = inject<WidgetInjection<boolean | 'indeterminate', Cardinality>>('widget')
if (!model) {
  throw new Error('Checkbox must be used within a Widget component.')
}

const state = computed<'checked' | 'unchecked' | 'indeterminate'>(() => model.value === 'indeterminate' ? 'indeterminate' : model.value ? 'checked' : 'unchecked')

const input = ref<HTMLInputElement>()
watch(state, state => {
  if (state === 'indeterminate' && input.value) {
    input.value.indeterminate = true
  } else if (input.value) {
    input.value.indeterminate = false
  }
}, { immediate: true })
</script>