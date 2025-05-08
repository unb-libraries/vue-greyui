<template>
  <stylable-layout
    :id="id"
    :layout="layout"
    :value="value"
    :name="name"
    :valid="valid"
    :error="error"
    v-bind="attrs"
    @update="(newValue: string) => $emit('update:modelValue', newValue)"
    @validate="onValidate"
    @clear="$emit('update:modelValue', emptyValue)"
  />
</template>

<script setup lang="ts">
import { useInputAttrs, useValidate, type Validator } from "~/composables"
import { Stylable as StylableLayout, type StylableProps } from "~/components"
import { onMounted } from "vue"

export type WidgetTextLayoutProps = { value?: string }
export type WidgetTextLayoutEmits = { update: [newValue: string], clear: [], validate: [] }

defineOptions({ name: 'InputText', inheritAttrs: false })
const { id, name, ...attrs } = useInputAttrs()

const value = defineModel<string>({ required: false })
const props = defineProps<StylableProps<WidgetTextLayoutProps, WidgetTextLayoutEmits> & {
  required?: boolean
  pattern?: string
  valid?: boolean
  error?: string
}>()
const emits = defineEmits<{ validated: [valid: boolean, error?: string] }>()

const { validate, valid, error } = useValidate(value, [
  props.required && ((str: string) => Boolean(str) || 'This field is required.'),
  props.pattern && ((str: string) => new RegExp(props.pattern!).test(str) || `Must match the pattern ${props.pattern}.`),
].filter(Boolean) as Validator[], { autoValidate: false })

let emptyValue: string | undefined | null
onMounted(() => {
  emptyValue = !value.value ? '' : null
})

function onValidate() {
  const valid = validate(value.value)
  emits('validated', Boolean(valid), error?.value)
}

defineExpose({
  validate: onValidate,
  error,
})
</script>