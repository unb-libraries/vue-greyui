<template>
  <StylableLayout
    :id
    :name="name"
    :layout="layout"
    :value="modelValue"
    :cardinality="cardinality"
    :required="required"
    :min="bounds[0]"
    :max="bounds[1]"
    :valid="valid"
    :error="error"
    v-bind="attrs"
    @input="onInput"
    @clear="$emit('update:modelValue', emptyValue as TData<T, C>)"
    @validate="onValidate"
  />
</template>

<script lang="ts">
export type Cardinality = 'one' | 'many'
export type TData<T, C> = C extends 'one' ? T : T[]
export type WidgetProps<T, C extends Cardinality> = {
  cardinality?: C
  emptyValue: TData<T, C>
  required?: C extends 'many' ? undefined : boolean
  min?: C extends 'many' ? number : 0 | 1
  max?: C extends 'many' ? number : 1
  validators?: Validator<TData<T, C>>[]
  autoValidate?: boolean
}

export type WidgetEmits = {
  clear: []
  validated: [valid: boolean, error?: string]
}

export type WidgetLayoutEmits<T, C extends Cardinality> = Pick<WidgetEmits, 'clear'> & {
  input: [newValue: TData<T, C>]
  validate: [value?: TData<T, C>]
}

export type WidgetLayoutProps<T, C extends Cardinality> = StylableProps<{
  value?: TData<T, C>
  valid?: boolean
  error?: string
} & Omit<WidgetProps<T, C>, "validators" | "autoValidate">, WidgetLayoutEmits<TData<T, C>, C>>

export type IWidget = {
  validate: <T>(value: T) => true | string
}
</script>

<script lang="ts" setup generic="T, C extends Cardinality, P extends WidgetLayoutProps<T, C>, E extends WidgetLayoutEmits<T, C>">
import { computed, onMounted, ref, watch } from 'vue'
import { type StylableProps, Stylable as StylableLayout } from '~/components'
import { useInputAttrs } from '~/composables'
import type { Validator } from '~/components'

const { id, name, ...attrs } = useInputAttrs()
const modelValue = defineModel<TData<T, C>>()
const props = defineProps<StylableProps<P, E> & WidgetProps<T, C>>()
const emits = defineEmits<WidgetEmits>()

let emptyValue: TData<T, C> | null
onMounted(() => {
  emptyValue = JSON.stringify(modelValue.value ?? props.emptyValue) === JSON.stringify(props.emptyValue)
    ? props.emptyValue
    : null
})

const bounds = computed(() => {
  const min = props.cardinality === 'many' ? Math.max(0, props.min ?? 0) : props.required ? 1 : 0
  const max = props.cardinality === 'many' ? Math.max(min, props.max ?? Infinity) : 1
  return [min, max] as [number, number]
})

const validators = computed(() => {
  const [min, max] = bounds.value
  return [
    props.cardinality !== 'many' && props.required && ((str: string) => Boolean(str) || 'This field is required.'),
    props.cardinality === 'many' && min && ((value: T[]) => value?.length >= min || `Require at least ${min} items.`),
    props.cardinality === 'many' && max && ((value: T[]) => value?.length <= max || `Accept no more than ${max} items.`),
    ...(props.validators ?? []),
  ].filter(Boolean) as Validator<TData<T, C>>[]
})

const error = ref<string>()
const valid = ref<boolean>()

function onInput(newValue?: TData<T, C>) {
  modelValue.value = newValue
}

function validate(value: TData<T, C>) {
  let index = 0, res: true | string = true
  while (index < validators.value.length && res === true) {
    res = validators.value[index++](value)
  }

  valid.value = typeof res !== 'string'
  error.value = typeof res === 'string'
    ? res
    : undefined

  return res
}

function onValidate(value?: TData<T, C>) {
  const res = validate(value ?? modelValue.value)
  emits('validated', res === true, typeof res === 'string' ? res : undefined)
  return res
}

if (props.autoValidate) {
  watch(modelValue, onValidate)
}

defineExpose({
  validate: onValidate,
})
</script>