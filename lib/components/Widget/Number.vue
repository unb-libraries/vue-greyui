<template>
  <stylable-layout
    :id="id"
    :layout="layout"
    :value="value"
    :name="name"
    :decimals="decimals"
    :valid="valid"
    :error="error"
    v-bind="attrs"
    @update="(newValue: number) => onUpdate(newValue)"
    @validate="onValidate"
    @clear="$emit('update:modelValue', emptyValue)"
  />
</template>

<script lang="ts" setup>
import { useInputAttrs, useValidate, type Validator } from "~/composables"
import { onMounted } from 'vue'
import { type StylableProps, Stylable as StylableLayout } from '~/components'

type WidgetNumberProps = { decimals?: number, required?: boolean, min?: number, max?: number }
export type WidgetNumberLayoutProps = { value?: number } & WidgetNumberProps
export type WidgetNumberLayoutEmits = { update: [newValue: number], clear: [], validate: [] }

defineOptions({ name: 'WidgetNumber', inheritAttrs: false })
const { id, name, ...attrs } = useInputAttrs()
const value = defineModel<number>()
const props = defineProps<StylableProps<WidgetNumberLayoutProps, WidgetNumberLayoutEmits> & WidgetNumberProps>()
const emits = defineEmits<{ validated: [valid: boolean, error?: string] }>()

let emptyValue: number
onMounted(() => {
  emptyValue = !value.value ? 0 : null
})

const { validate, valid, error } = useValidate(value, [
  props.required && ((value: number) => Boolean(value) || 'This field is required.'),
  props.min !== undefined && ((value: number) => value >= props.min || `Must be greater than or equal to ${props.min}.`),
  props.max !== undefined && ((value: number) => value <= props.max || `Must be less than or equal to ${props.max}.`),
].filter(Boolean) as Validator[], { autoValidate: false })

function onUpdate(newValue: number) {
  if (validate(newValue) === true) {
    value.value = newValue
  }
}

function onValidate() {
  const valid = validate(value.value)
  emits('validated', Boolean(valid), error?.value)
}

defineExpose({
  validate: onValidate,
  get error() { return error?.value },
})
</script>