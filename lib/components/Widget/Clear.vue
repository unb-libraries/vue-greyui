<template>
  <button v-show="!isEmpty()"
    type="button"
    tabindex="-1"
    @click.stop="clear(emptyValue)"
  >
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

const widget = props.widget || inject<WidgetInjection<T, C>>('widget')
if (!widget) {
  throw new Error('WidgetClear must be passed a widget props or used inside a Widget component')
}

const { clear, isEmpty } = widget
</script>