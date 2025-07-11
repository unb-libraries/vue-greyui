<template>
  <Widget
    :as="as"
    :cardinality="(cardinality as C)"
    :as-child="asChild"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event as TModel<T, C>)"
    v-slot="slotProps"
  >
    <slot v-bind="slotProps" />
  </Widget>
</template>

<script lang="ts">
type WidgetOptionsProps<T, C extends Cardinality> = WidgetProps<T, C> & {
  options: DataProvider<T>['data']['value']
}
export type WidgetOptionsInjection<T, C extends Cardinality> = Pick<WidgetOptionsProps<T, C>, 'options'>
</script>

<script lang="ts" setup generic="T, C extends Cardinality">
import { provide } from 'vue'
import type { TModel, WidgetProps, Cardinality } from '~/components'
import { Widget } from '~/components'
import type { DataProvider } from '~/composables'

defineOptions({ name: 'WidgetOptions' })
defineModel<TModel<T, C>>({ required: false })
const props = withDefaults(defineProps<WidgetOptionsProps<T, C>>(), {
  cardinality: () => 'one' as C,
  validators: () => ({}),
  acceptInvalid: () => false,
})

provide<WidgetOptionsInjection<T, C>>('widget-options', {
  options: props.options,
})
</script>