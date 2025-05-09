<template>
  <stylable-layout
    :id="id"
    :layout="layout"
    :value="value"
    :name="name"
    :valid="valid"
    :error="error"
    v-bind="attrs"
    @update="(newValue: boolean) => $emit('update:modelValue', newValue)"
    @validate="onValidate"
  />
</template>

<script lang="ts" setup>
import { useInputAttrs, useValidate, type Validator } from "~/composables"
import { type StylableProps, Stylable as StylableLayout } from '~/components'

type WidgetCheckboxProps = { required?: boolean }
export type WidgetCheckboxLayoutProps = { value?: boolean } & WidgetCheckboxProps
export type WidgetCheckboxLayoutEmits = { update: [newValue: boolean] }

defineOptions({ name: 'WidgetCheckbox', inheritAttrs: false })
const { id, name, ...attrs } = useInputAttrs()
const value = defineModel<boolean>()
const props = defineProps<StylableProps<WidgetCheckboxLayoutProps, WidgetCheckboxLayoutEmits> & WidgetCheckboxProps>()
const emits = defineEmits<{ validated: [valid: boolean, error?: string] }>()

const { validate, valid, error } = useValidate(value, [
  props.required && ((value: number) => Boolean(value) || 'This field is required.'),
].filter(Boolean) as Validator[], { autoValidate: false })

function onValidate() {
  const valid = validate(value.value)
  emits('validated', Boolean(valid), error?.value)
}

defineExpose({
  validate: onValidate,
  get error() { return error?.value },
})
</script>