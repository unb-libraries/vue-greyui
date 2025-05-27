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
    @select="onSelect"
    @unselect="onUnselect"
    @add="onAdd"
    @filter="onFilter"
  />
</template>

<script lang="ts">
type Cardinality = 'one' | 'many'
type TData<C extends Cardinality> = C extends 'one' ? string : string[]
export type WidgetOptionsProps<T extends string | number | object = string, C extends Cardinality = 'one'> = {
  cardinality?: C
  options: DataProvider<T>
  labelKey?: T extends object ? keyof T : undefined
  optionKey?: T extends object ? keyof T : undefined
  min?: C extends 'many' ? number : 0 | 1
  max?: C extends 'many' ? number : 1
} & Omit<WidgetProps<TData<C>>, 'emptyValue'>

export type WidgetOptionsLayoutEmits<T extends string | number | object = string> = {
  toggle: [...option: T[]]
  select: [...option: T[]]
  unselect: [...option: T[]]
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

function getKey(option: T) {
  return (typeof option === 'object' ? option[props.optionKey] : option) as string
}

const emptyValue = computed(() => props.cardinality === 'many' ? [] : '')
const optionValues = computed(() => props.options.data.value.map(getKey))
const options = computed(() => props.options.data.value.filter((o, i) => optionValues.value.indexOf(getKey(o)) === i))
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
    ? newValue?.filter((o, i) => newValue.indexOf(o) === i) ?? newValue
    : (newValue[0] ?? emptyValue.value)) as TData<C>
}

function onToggle(...toggled: T[]) {
  onUpdate(toggled.reduce((selected, item) => {
    const option = (typeof item === 'object' ? item[props.optionKey] : item) as string
    return selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option]
  }, selected.value))
}

function onSelect(...added: T[]) {
  onUpdate([...selected.value, ...added
    .map(getKey)
    .filter(Boolean)
    .filter(option => optionValues.value.includes(option))])
}

function onUnselect(...unselected: T[]) {
  console.log('unselect', unselected)
  onUpdate(selected.value.filter(option => !unselected.map(getKey).includes(option)))
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