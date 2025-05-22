<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :cardinality="cardinality"
    :model-value="inputValue"
    :empty-value="emptyValue"
    :validators="validators"
    :auto-validate="false"
    @update:model-value="onUpdate"
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
export type WidgetTextLayoutProps = StylableProps<WidgetLayoutProps<string[]> & WidgetTextProps, WidgetLayoutEmits<string[]>>
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
  props.cardinality === 'many' && props.min && ((arr: string[]) => arr.length >= props.min || `Must have at least ${props.min} items.`),
  props.cardinality === 'many' && props.max && ((arr: string[]) => arr.length <= props.max || `Must have at most ${props.max} items.`),
  props.cardinality === 'many' && props.pattern && ((arr: string[]) => arr.every(new RegExp(props.pattern!).test) || `Must match the pattern ${props.pattern}.`),
  props.cardinality === 'many' && props.required && ((arr: string[]) => arr.length > 0 || 'This field is required.'),
  props.cardinality === 'many' && props.unique && ((arr: string[]) => arr.length === new Set(arr).size || 'Items must be unique.'),
].filter(Boolean) as Validator<string[]>[])

function onUpdate(newValue?: string[]) {
  value.value = (!newValue || props.cardinality === 'many'
    ? newValue
    : (newValue[0] ?? emptyValue.value)) as TData<C>
}

defineExpose({
  validate: widget.value?.validate,
})
</script>