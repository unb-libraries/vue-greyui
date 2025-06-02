<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :model-value="value"
    :decimals="decimals"
    :empty-value="[]"
    :auto-validate="false"
    @update:model-value="onUpdate"
  />
</template>

<script lang="ts">
export type WidgetNumberEmits = WidgetEmits
export type WidgetNumberProps<C extends Cardinality> = {
  cardinality?: C
  decimals?: number
  min?: C extends 'many' ? number : 0 | 1
  max?: C extends 'many' ? number : 1
  ceil?: number
  floor?: number
}

export type WidgetNumberLayoutEmits<C extends Cardinality> = WidgetLayoutEmits<number, C>
export type WidgetNumberLayoutProps<C extends Cardinality> = StylableProps<WidgetLayoutProps<number, C> & WidgetNumberProps<C>, WidgetNumberLayoutEmits<C>>
</script>

<script lang="ts" setup generic="C extends Cardinality">
import { computed, ref } from 'vue'
import type { IWidget, WidgetLayoutProps, StylableProps, WidgetLayoutEmits, WidgetEmits, TData, Cardinality } from '~/components'
import { Widget as WidgetBase } from '~/components'

const widget = ref<IWidget>()
const modelValue = defineModel<TData<number, C>>()
const value = computed<number[]>(() => (props.cardinality === 'many'
  ? modelValue.value ?? []
  : modelValue.value !== undefined ? [modelValue.value] : []) as number[])
const props = defineProps<WidgetNumberLayoutProps<C> & WidgetNumberProps<C>>()
defineEmits<WidgetNumberEmits>()

const emptyValue = computed<number[] | number>(() => props.cardinality === 'many' ? [] : Math.max(props.floor ?? 0, 0))

function onUpdate(newValue?: number[]) {
  const validatedNewValue =
    (v: number) => Math.min(Math.max(v, props.floor ?? -Infinity), props.ceil ?? Infinity)
  modelValue.value = (!newValue
    ? newValue
    : props.cardinality === 'many'
      ? newValue.map(validatedNewValue)
      : validatedNewValue(newValue[0] ?? emptyValue.value as number)) as TData<number, C>
}

defineExpose({
  validate: widget.value?.validate,
})
</script>