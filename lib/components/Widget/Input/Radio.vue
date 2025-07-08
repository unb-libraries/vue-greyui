<template>
  <input
    ref="input"
    type="radio"
    :id="`${name}[${value}]`"
    :name="name"
    v-model="model"
    :value="JSON.stringify(value)"
    :data-checked="value === model ? '' : undefined" />
</template>

<script lang="ts" setup generic="T">
import { inject } from 'vue'
import { WidgetInjection } from '~/components'

defineOptions({ name: 'InputRadio' })
defineProps<{
  value: T
}>()

const { value: model, cardinality, id, name } = inject<WidgetInjection<T, 'one'>>('widget')
if (!model) {
  throw new Error('Radio must be used within a Widget component.')
}
if (cardinality !== 'one') {
  throw new Error('Radio must be used within a single-choice Widget component.')
}
</script>