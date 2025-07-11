<template>
  <Widget as-child :model-value="checked" @update:model-value="onChange">
    <InputCheckbox :id="`${id}[__all__]`" :name="`${name}-all`" />
  </Widget>
</template>

<script lang="ts" setup>
import { computed, inject, watch } from 'vue'
import { InputCheckbox, Widget, WidgetInjection, type WidgetOptionsInjection } from '~/components'

const { value, id, name } = inject<WidgetInjection<string, 'many'>>('widget')
const { options } = inject<WidgetOptionsInjection<string, 'many'>>('widget-options')
if (!value || !options) {
  throw new Error('WidgetOptions must be used within a WidgetOptions context')
}

const checked = computed(() => {
  const optionKeys = Object.keys(options)
  const selectedKeys = Object.values(value.value)
  const selectedCount = optionKeys.filter(key => selectedKeys.includes(key)).length
  return selectedCount === optionKeys.length
    ? true
    : selectedCount > 0
      ? 'indeterminate'
      : false
})

watch(checked, (newValue) => {
  console.log('CheckboxAll state changed:', newValue)
}, { immediate: true })

function onChange(checked: boolean) {
  if (checked) {
    value.value = Object.fromEntries(Object.keys(options).map(key => [key, key]))
  } else {
    value.value = {}
  }
}
</script>