<template>
  <WidgetBase
    ref="widget"
    :layout="layout"
    :model-value="selected"
    :empty-value="emptyValue"
    :options="options"
    :label-key="labelKey"
    :option-key="optionKey"
    :min="bounds[0]"
    :max="bounds[1]"
    :validators="validators"
    :auto-validate="autoValidate"
    @update:model-value="onUpdate"
    @toggle="onToggle"
    @add="onAdd"
    @filter="onFilter"
  />
</template>

<script lang="ts">
type Cardinality = 'one' | 'many'
type TData<C extends Cardinality> = C extends 'one' ? string : string[]
type WidgetOptionsProps<T extends string | number | object = string, C extends Cardinality = 'one'> = {
  cardinality?: C
  options: DataProvider<T>
  labelKey?: T extends object ? keyof T : undefined
  optionKey?: T extends object ? keyof T : undefined
  min?: C extends 'many' ? number : 0 | 1
  max?: C extends 'many' ? number : 1
} & Omit<WidgetProps<TData<C>>, 'emptyValue'>

export type WidgetOptionsLayoutEmits<T extends string | number | object = string> = {
  toggle: [option: T]
  add: [option: T]
  filter: [filter: (item: T) => boolean]

} & WidgetLayoutEmits<T>

export type WidgetOptionsLayoutProps<T extends string | number | object = string, C extends Cardinality = 'one'> =
  StylableProps<
    WidgetLayoutProps<T> & WidgetOptionsProps<T, C>,
    WidgetOptionsLayoutEmits<T>
  >
</script>

<script setup lang="ts" generic="T extends string | number | object = string, C extends Cardinality = 'one'">
import { type Validator, type DataProvider } from '~/composables'
import { Widget as WidgetBase, type IWidget, type WidgetProps, type WidgetLayoutProps, type WidgetEmits, type WidgetLayoutEmits, StylableProps } from '~/components'
import { computed, ref } from 'vue'

const widget = ref<IWidget>()
const value = defineModel<TData<C>>({ required: false })
const selected = computed<string[]>(() => Array.isArray(value.value) ? value.value : value.value ? [value.value] : [])
const props = defineProps<WidgetOptionsProps<T, C> & WidgetOptionsLayoutProps<T, C>>()
const emits = defineEmits<WidgetEmits>()


const emptyValue = computed(() => props.cardinality === 'many' ? [] : '')
const options = computed(() => props.options.data.value)
const bounds = computed(() => [
  props.cardinality === 'many' ? Math.max(0, props.min) : Math.min(1, props.min),
  props.cardinality === 'many' ? Math.max(0, props.max) : Math.min(1, props.max),
])
const validators = computed(() => [
  props.min && ((value: string[]) => value.length >= props.min || `Minimum ${props.min} items required.`),
  props.max && ((value: string[]) => value.length <= props.max || `Maximum ${props.max} items allowed.`),
].filter(Boolean) as Validator[])

function onUpdate(newValue?: string[]) {
  value.value = (!newValue || props.cardinality === 'many'
    ? newValue
    : (newValue[0] ?? emptyValue.value)) as TData<C>
}

function onToggle(toggled: T) {
  const option = (typeof toggled === 'object' ? toggled[props.optionKey] : toggled) as string
  const newValue = selected.value.includes(option)
    ? selected.value.filter((item) => item !== option)
    : [...selected.value, option]
  value.value = (props.cardinality === 'many' ? newValue : newValue[0]) as TData<C>
}

function onAdd(option: T) {
  props.options.add(option)
}

function onFilter(filter: (item: T) => boolean) {
  props.options.filter(filter)
}

defineExpose({
  validate: widget.value?.validate,
})
</script>