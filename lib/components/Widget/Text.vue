<template>
  <widget-base
    ref="widget"
    :layout="layout"
    :cardinality="cardinality"
    :model-value="modelValue"
    :empty-value="((cardinality === 'many' ? [] : '') as TData<string, C>)"
    :min="min"
    :max="max"
    :required="required"
    :validators="validators"
    :auto-validate="autoValidate"
    @update:model-value="onUpdate"
    @add="onAdd"
    @remove="onRemove"
  />
</template>

<script lang="ts">
export type WidgetTextProps<C extends Cardinality> = {
  cardinality?: C
  pattern?: string
  min?: C extends 'many' ? number : 0 | 1
  max?: C extends 'many' ? number : 1
  unique?: C extends 'many' ? boolean : undefined
  required?: C extends 'many' ? undefined : boolean
}

export type WidgetTextEmits = WidgetEmits
export type WidgetTextLayoutEmits<C extends Cardinality> = WidgetLayoutEmits<string, C> & {
  add: [newValue: string]
  remove: [indexOrValue: number | string]
}
export type WidgetTextLayoutProps<C extends Cardinality> = StylableProps<WidgetLayoutProps<string, C> & WidgetTextProps<C>, WidgetTextLayoutEmits<C>>
</script>

<script setup lang="ts" generic="C extends Cardinality = 'one'">
import { Widget as WidgetBase, WidgetEmits, WidgetLayoutEmits, WidgetLayoutProps } from "~/components"
import type { IWidget, StylableProps, TData, Cardinality } from "~/components"
import { computed, ref } from "vue"
import { type Validator } from "~/components"

const widget = ref<IWidget>()
const value = defineModel<TData<string, C>>({ required: false })
const inputValue = computed<string[]>(() => (Array.isArray(value.value) ? value.value : value.value ? [value.value] : []) as string[])
const props = defineProps<WidgetTextLayoutProps<C> & WidgetTextProps<C>>()
defineEmits<WidgetEmits>()

const validators = computed(() => [
  props.cardinality !== 'many' && props.pattern && ((str: string) => new RegExp(props.pattern, 'i').test(str) || `Must match the pattern ${props.pattern}.`),
  props.cardinality === 'many' && props.pattern && ((arr: string[]) => (arr ?? []).every(str => new RegExp(props.pattern, 'i').test(str)) || `Must match the pattern ${props.pattern}.`),
  props.cardinality === 'many' && props.unique && ((arr: string[]) => (arr ?? []).length === new Set(arr).size || 'Items must be unique.'),
].filter(Boolean) as Validator<TData<string, C>>[])
const autoValidate = computed(() => props.cardinality === 'many')

function onUpdate(newValue?: TData<string, C>) {
  value.value = newValue
}

function onAdd(newValue: string) {
  if (Array.isArray(value.value)) {
    const newModelValue = [...inputValue.value ?? [], newValue]
    if (props.cardinality === 'many' && widget.value?.validate(newModelValue) === true) {
      onUpdate(newModelValue as TData<string, C>)
    }
  }
}

function onRemove(indexOrValue: number | string) {
  if (props.cardinality === 'many') {
    const index = typeof indexOrValue === 'string'
      ? inputValue.value.indexOf(indexOrValue as string)
      : indexOrValue
    if (index > -1) {
      onUpdate(inputValue.value.filter((_, i) => i !== index) as TData<string, C>)
    }
  }
}

defineExpose({
  validate: widget.value?.validate,
})
</script>