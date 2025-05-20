<template>
  <StylableLayout
    :id
    :name="name"
    :layout="layout"
    :value="modelValue"
    :valid="valid"
    :error="error"
    v-bind="attrs"
    @input="(newValue: T) => $emit('update:modelValue', newValue)"
    @clear="$emit('update:modelValue', emptyValue as T)"
    @validate="onValidate"
  />
</template>

<script lang="ts">
export type WidgetProps<T> = {
  emptyValue: T
  validators?: Validator<T>[]
  autoValidate?: boolean
}

export type WidgetEmits = {
  clear: []
  validated: [valid: boolean, error?: string]
}

export type WidgetLayoutEmits<T> = Pick<WidgetEmits, 'clear'> & {
  input: [newValue: T]
  validate: []
}

export type WidgetLayoutProps<T> = StylableProps<{
  value?: T
  valid?: boolean
  error?: string
}, WidgetLayoutEmits<T>>

export type IWidget = {
  validate: () => void
}
</script>

<script lang="ts" setup generic="T, P extends WidgetLayoutProps<T>, E extends WidgetLayoutEmits<T>">
import { onMounted, ref, watch } from 'vue'
import { type StylableProps, Stylable as StylableLayout } from '~/components'
import { useInputAttrs, type Validator } from '~/composables'

const { id, name, ...attrs } = useInputAttrs()
const modelValue = defineModel<T>()
const props = defineProps<StylableProps<P, E> & WidgetProps<T>>()
const emits = defineEmits<WidgetEmits>()

let emptyValue: T | null
onMounted(() => {
  emptyValue = !modelValue.value ? props.emptyValue : null
})

const error = ref<string>()
const valid = ref<boolean>()

function validate(value: T) {
  let index = 0, res: true | string = true
  while (index < props.validators.length && res === true) {
    res = props.validators[index++](value)
  }

  valid.value = typeof res !== 'string'
  error.value = typeof res === 'string'
    ? res
    : undefined

  return res
}

function onValidate() {
  const res = validate(modelValue.value)
  emits('validated', res === true, typeof res === 'string' ? res : undefined)
}

if (props.autoValidate) {
  watch(modelValue, onValidate)
}

defineExpose({
  validate: onValidate,
})
</script>