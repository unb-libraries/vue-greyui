<template>
  <button v-show="!isEmpty()" type="button" tabindex="-1" @click.stop="onClick">
    <slot>Clear</slot>
  </button>
</template>

<script lang="ts" setup generic="T, C extends Cardinality">
import type { Cardinality, TWidget, WidgetInjection } from '~/components'
import { inject } from 'vue'

defineOptions({ name: 'WidgetClear' })
const props = defineProps<{
  widget?: WidgetInjection<T, C>
  emptyValue?: TWidget<T, C>
}>()

const { value, cardinality, initialValue } = props.widget || inject<WidgetInjection<T, C>>('widget')
if (!value) {
  throw new Error('WidgetClear must be passed a widget props or used inside a Widget component')
}

function isEmpty() {
  return !value.value || (cardinality === 'many' && !Object.keys(value.value as TWidget<T, 'many'>).length)
}

function wasInitiallyEmpty(): boolean {
  return !initialValue
    || (cardinality === 'many' && !Object.keys(initialValue as TWidget<T, 'many'>).length)
}

function onClick() {
  if (!value.value) return
  let emptyValue = props.emptyValue ?? (() => {
    switch (typeof value.value) {
      case 'string': return '' as TWidget<T, C>
      case 'number': return 0 as TWidget<T, C>
      case 'boolean': return false as TWidget<T, C>
      case 'object': return (Array.isArray(value.value)) ? [] : {}
    }
  })() as TWidget<T, C>
  value.value = wasInitiallyEmpty() ? emptyValue as TWidget<T, C> : null
}
</script>