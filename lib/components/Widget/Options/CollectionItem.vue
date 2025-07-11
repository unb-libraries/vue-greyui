<template>
  <slot :option="option" :key="key" />
</template>

<script lang="ts" setup generic="T, C extends Cardinality">
import { computed, inject, provide } from 'vue'
import type { WidgetInjection, Cardinality, TWidget } from '~/components'

const props = defineProps<{
  option: T
  key: string
}>()

const { value: selection, cardinality, ...widget } = inject<WidgetInjection<string, C>>('widget')
if (!selection) {
  throw new Error('WidgetOptions must be used within a Widget context')
}
if (cardinality === 'many') {
  var { add, remove } = inject<WidgetInjection<string, 'many'>>('widget')
}

const selected = computed(() => cardinality === 'one'
  ? selection.value === props.key
  : Object.values(selection.value).includes(props.key))

provide<WidgetInjection<boolean, 'one'>>('widget', {
  value: computed({
    get: () => selected.value,
    set: (selected: boolean) => {
      if (cardinality === 'one') {
        selection.value = (selected ? props.key : undefined) as TWidget<string, C>
      } else if (selected) {
        add(props.key)
      } else {
        remove(props.key)
      }
    },
  }),
  cardinality: 'one',
  ...widget,
} as WidgetInjection<boolean, 'one'>)
</script>