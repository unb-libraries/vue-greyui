<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :cardinality="cardinality"
    :model-value="inputValue"
    :empty-value="emptyValue"
    :validators="validators"
    :auto-validate="autoValidate"
    @update:model-value="onUpdate"
    @add="onAdd"
    @remove="onRemove"
  />
</template>

<script lang="ts">
type Cardinality = 'one' | 'many'
type TData<C extends Cardinality> = C extends 'many' ? string[] : string
type WidgetTextProps = {
  cardinality?: Cardinality
  required?: boolean
  pattern?: string
  min?: number
  max?: number
  unique?: boolean
}

type WidgetTextLayoutEmits<T> = WidgetLayoutEmits<T> & {
  add: [newValue: string]
  remove: [indexOrValue: number | string]
}
export type WidgetTextLayoutProps = StylableProps<WidgetLayoutProps<string[]> & WidgetTextProps, WidgetTextLayoutEmits<string[]>>
</script>

<script setup lang="ts" generic="C extends Cardinality = 'one'">
import { IWidget, type StylableProps, Widget as WidgetBase, WidgetEmits, WidgetLayoutEmits, WidgetLayoutProps } from "~/components"
import { computed, ref } from "vue"
import { type Validator } from "~/composables"

const widget = ref<IWidget>()
const value = defineModel<TData<C>>({ required: false })
const inputValue = computed<string[]>(() => (Array.isArray(value.value) ? value.value : typeof value.value === 'string' ? [value.value] : value.value) as string[])
const props = defineProps<WidgetTextLayoutProps & WidgetTextProps>()
defineEmits<WidgetEmits>()
const emptyValue = computed(() => props.cardinality === 'many' ? [] : '')
const validators = computed(() => [
  props.cardinality === 'many' && props.min && ((arr: string[]) => (arr ?? []).length >= props.min || `Must have at least ${props.min} items.`),
  props.cardinality === 'many' && props.max && ((arr: string[]) => (arr ?? []).length <= props.max || `Must have at most ${props.max} items.`),
  props.pattern && ((arr: string[]) => (arr ?? []).every(str => new RegExp(props.pattern, 'i').test(str)) || `Must match the pattern ${props.pattern}.`),
  props.cardinality === 'many' && props.unique && ((arr: string[]) => (arr ?? []).length === new Set(arr).size || 'Items must be unique.'),
  props.cardinality !== 'many' && props.required && ((arr: string[]) => (arr ?? []).length > 0 || 'This field is required.'),
].filter(Boolean) as Validator<string[]>[])
const autoValidate = computed(() => props.cardinality === 'many')

function onUpdate(newValue?: string[]) {
  value.value = ((!newValue || props.cardinality === 'many')
    ? newValue
    : newValue[0] ?? emptyValue.value) as TData<C>
}

function onAdd(newValue: string) {
  const newModelValue = [...inputValue.value ?? [], newValue]
  if (props.cardinality === 'many' && widget.value?.validate(newModelValue) === true) {
    onUpdate(newModelValue)
  }
}

function onRemove(indexOrValue: number | string) {
  if (props.cardinality === 'many') {
    const index = typeof indexOrValue === 'string'
      ? inputValue.value.indexOf(indexOrValue as string)
      : indexOrValue
    if (index > -1) {
      onUpdate(inputValue.value.filter((_, i) => i !== index))
    }
  }
}

defineExpose({
  validate: widget.value?.validate,
})
</script>