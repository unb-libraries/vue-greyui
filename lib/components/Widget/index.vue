<template>
  <Primitive
    ref="el"
    :as
    :as-child
    :data-invalid="valid === false ? '' : undefined"
    :data-error="valid === false ? errors.join(' ') : undefined"
    v-bind="attrs"
  >
    <slot v-bind="injection" />
  </Primitive>
</template>

<script lang="ts">
import type { Ref } from 'vue'
import type { Cardinality, PrimitiveProps } from '~/components'

export type TModel<T, C extends Cardinality = 'one'> =
  C extends 'one' ? T : T[]
export type TWidget<T, C extends Cardinality = 'one'> =
  C extends 'one' ? T : Record<string, T>
export type WidgetProps<T, C extends Cardinality> = PrimitiveProps & {
  cardinality?: C
  validators?: Record<string, (value: TModel<T, C>) => boolean>
  acceptInvalid?: boolean
}
export type WidgetInjection<T, C extends Cardinality = 'one'> = {
  $el: Ref<HTMLElement>
  cardinality: C
  id: string
  name: string
  value: Ref<TWidget<T, C>>
  initialValue: TWidget<T, C>
  isEmpty: () => boolean
  wasInitiallyEmpty: () => boolean
  valid: Ref<boolean>
  errors: Ref<string[]>
  clear: (emptyValue?: TWidget<T, C>) => void
  validate: (value: TModel<T, C>) => void
  clearError: (error: keyof WidgetProps<T, C>['validators']) => void
} & (C extends 'many' ? {
  add: (item: T) => void
  remove: (key: string) => void
} : {})

export type WidgetInterface<T, C extends Cardinality> = {
  $el: Ref<HTMLElement>
  validate: () => boolean
} & Pick<WidgetInjection<T, C>, 'clearError'>
</script>

<script lang="ts" setup generic="T, C extends Cardinality = 'one'">
import { computed, inject, onMounted, provide, ref, useAttrs, useId, watch } from 'vue'
import { Primitive, FormFieldInjection } from '~/components'

defineOptions({ name: 'Widget', inheritAttrs: false })
const { id: formFieldId, name: formFieldName } = inject<Partial<FormFieldInjection>>('form-field', {})
const { id, name, ...attrs } = (() => {
  const defaultName = useId()
  const { id, name, ...attrs } = useAttrs() as { id?: string, name?: string }
  return {
    id: id ?? formFieldId ?? `w-${defaultName}`,
    name: name ?? formFieldName ?? defaultName,
    ...attrs
  }
})()

const value = defineModel<TModel<T, C>>({ required: false })
const props = withDefaults(defineProps<WidgetProps<T, C>>(), {
  cardinality: () => 'one' as C,
  validators: () => ({}),
  acceptInvalid: false,
})

let index = props.cardinality === 'many' && (value.value as T[] ?? []).length
let keys = props.cardinality === 'many' && (value.value as T[] ?? []).map((_, i) => String(i))

const valueMap = computed({
  get: () => (props.cardinality !== 'many'
    ? value.value
    : Object.fromEntries((value.value as T[] ?? [])
      .map((v, i) => [keys![i] ?? String(i), v]
      ))) as TWidget<T, C>,
  set: (v: TWidget<T, C>) => {
    if (props.cardinality !== 'many') {
      const valid = validate(v as TModel<T, C>)
      value.value = !valid && !props.acceptInvalid
        ? value.value
        : v as TModel<T, C>
      value.value = v as TModel<T, C>
    } else {
      const valid = validate(Object.values(v) as TModel<T, C>)
      keys = Object.keys(v)
      value.value = !valid && !props.acceptInvalid
        ? value.value
        : Object.values(v) as TModel<T, C>
    }
  },
})

let initialValue: TWidget<T, C>
onMounted(() => {
  initialValue = valueMap.value
})

function isEmpty() {
  return !value.value || (props.cardinality === 'many' && !Object.keys(valueMap.value as TWidget<T, 'many'>).length)
}

function wasInitiallyEmpty(): boolean {
  return !initialValue
    || (props.cardinality === 'many' && !Object.keys(initialValue as TWidget<T, 'many'>).length)
}

function clear(emptyValue?: TWidget<T, C>) {
  if (!valueMap.value) return
  emptyValue ??= (() => {
    switch (typeof value.value) {
      case 'string': return '' as TWidget<T, C>
      case 'number': return 0 as TWidget<T, C>
      case 'boolean': return false as TWidget<T, C>
      case 'object': return (Array.isArray(value.value)) ? [] : {}
    }
  })() as TWidget<T, C>
  valueMap.value = wasInitiallyEmpty() ? emptyValue as TWidget<T, C> : null
}

const errors = defineModel<string[]>('error', { required: false, default: () => [] })
const valid = computed(() => errors.value.length === 0)

watch(value, validate)
function validate(value: TModel<T, C>): boolean {
  const e = Object
    .entries(props.validators ?? {})
    .filter(([, validator]) => validator && !validator(value))
    .map(([key]) => key)
  errors.value = e
  return e.length === 0
}

function clearError(error: keyof WidgetProps<T, 'one'>['validators']) {
  errors.value = errors.value.filter(e => e !== error)
}

const el = ref<{ $el: HTMLElement }>()
const $el = computed(() => el.value?.$el) as Ref<HTMLElement>

const injection = {
  $el,
  id,
  name,
  value: valueMap,
  // TODO: Make this reactive (computed)
  cardinality: props.cardinality,
  initialValue,
  isEmpty,
  wasInitiallyEmpty,
  valid,
  errors,
  clear,
  validate,
  clearError,
  ...props.cardinality === 'many' ? {
    add(item: T) {
      const key = String(index++)
      valueMap.value = {
        ...(valueMap.value ?? {} as TWidget<T, C>),
        [key]: item
      }
    },
    remove(key: string) {
      valueMap.value = Object
        .fromEntries(Object
          .entries(valueMap.value)
          .filter(([k]) => k !== key)) as TWidget<T, C>
    },
  } : {},
} as WidgetInjection<T, C>

provide<WidgetInjection<T, C>>('widget', injection)

defineExpose({
  $el,
  validate: () => validate(value.value),
  clearError,
} as WidgetInterface<T, C>)
</script>