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
  props.pattern && ((arr: string[]) => arr.every(str => new RegExp(props.pattern, 'i').test(str)) || `Must match the pattern ${props.pattern}.`),
  props.cardinality === 'many' && props.unique && ((arr: string[]) => arr.length === new Set(arr).size || 'Items must be unique.'),
  props.cardinality === 'one' && props.required && ((arr: string[]) => arr.length > 0 || 'This field is required.'),
].filter(Boolean) as Validator<string[]>[])
const autoValidate = computed(() => props.cardinality === 'many')

function onUpdate(newValue?: string[]) {
  if (!newValue || (props.cardinality === 'many' && widget.value?.validate(newValue) === true)) {
    value.value = newValue as TData<C>
  } else if (props.cardinality !== 'many') {
    value.value = (newValue[0] ?? emptyValue.value) as TData<C>
  }
}

defineExpose({
  validate: widget.value?.validate,
})
</script>