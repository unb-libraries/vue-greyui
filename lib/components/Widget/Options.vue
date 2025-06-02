<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :model-value="value"
    :cardinality="cardinality"
    :empty-value="emptyValue"
    :options="options.data.value"
    :required="required"
    :min="min"
    :max="max"
    :auto-validate="autoValidate"
    @update:model-value="v => onUpdate(cardinality === 'many' ? v as string[] : [v])"
    @toggle="onToggle"
    @select="onSelect"
    @unselect="onUnselect"
    @add="onAdd"
    @filter="onFilter"
  />
</template>

<script lang="ts">
export type WidgetOptionsProps<T, C extends Cardinality> = {
  cardinality?: C
  options: DataProvider<T>
} & Omit<WidgetProps<T, C>, 'emptyValue' | 'validators'>

export type WidgetOptionsLayoutEmits<T, C extends Cardinality> = {
  toggle: [...option: T[]]
  select: [...option: T[]]
  unselect: [...option: T[]]
  add: [option: T]
  filter: [filter: (item: T) => boolean]
} & WidgetLayoutEmits<T, C>

export type WidgetOptionsLayoutProps<T, C extends Cardinality> =
  StylableProps<
    WidgetLayoutProps<T, C> & WidgetOptionsProps<T, C>,
    WidgetOptionsLayoutEmits<T, C>
  >
</script>

<script setup lang="ts" generic="T extends string | number | object = string, C extends Cardinality = 'one'">
import type { DataProvider, ProviderT, DataFilter } from '~/composables'
import { Widget as WidgetBase } from '~/components'
import type { IWidget, WidgetProps, WidgetLayoutProps, WidgetEmits, WidgetLayoutEmits, StylableProps, Cardinality, TData } from '~/components'
import { computed, ref } from 'vue'

const widget = ref<IWidget>()
const value = defineModel<TData<T, C>>({ required: false })
const selected = computed<string[]>(() => Array.isArray(value.value) ? value.value : value.value ? [value.value] : [])
const props = defineProps<WidgetOptionsProps<T, C> & WidgetOptionsLayoutProps<T, C>>()
const emits = defineEmits<WidgetEmits>()

const emptyValue = computed(() => props.cardinality === 'many' ? [] : undefined as TData<T, C>)

function onUpdate(newValue?: string[]) {
  value.value = (!newValue || props.cardinality === 'many'
    ? newValue?.filter((o, i) => newValue.indexOf(o) === i) ?? newValue
    : newValue[0]) as TData<T, C>
}

function onToggle(...toggled: ProviderT<T>[]) {
  onUpdate(toggled.reduce((selected, item) => {
    const option = item.id
    return selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option]
  }, selected.value as string[]))
}

function onSelect(...added: ProviderT<T>[]) {
  onUpdate([
    ...selected.value as string[],
    ...added
      .map(({ id }) => id)
      .filter(option => props.options.keys.value.includes(option))
  ])
}

function onUnselect(...unselected: ProviderT<T>[]) {
  onUpdate(selected.value.filter(option => !unselected.map(({ id }) => id).includes(option)))
}

function onAdd(option: T) {
  props.options.add(option)
}

function onFilter(filter: DataFilter<T>) {
  props.options.filter(filter)
}

defineExpose({
  validate: widget.value?.validate,
})
</script>