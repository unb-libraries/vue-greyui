<template>
  <form :id="formId">
    <slot :formId="formId" v-bind="form" />
  </form>
</template>

<script lang=ts>
export type Validation = {
  valid: boolean
  errors: string[]
}

interface FormField {
  validate: () => void
  reset: () => void
  clear: (emptyValue?: unknown) => void
  errors: Ref<string[]> | string[]
  resolve: (error?: string) => void
}

export type FormInjection = {
  id: string
  inForm: boolean
  register: (field: string, widget: FormField) => void
  validate: () => void
  clear: () => void
  reset: () => void
  errors: Ref<Record<string, string[]>>
  valid: Ref<boolean> | undefined
}

export type FormInterface = FormInjection
</script>

<script lang="ts" setup>
import { computed, provide, reactive, type Ref, unref, useAttrs, useId } from 'vue'

defineOptions({ name: 'Form' })

const formId = useAttrs().id as string ?? `form-${useId()}`
const fields = reactive<Record<string, FormField>>({})

const errors = computed(() => {
  return Object
    .fromEntries(Object
      .entries(fields)
      .map(([field, { errors: errs }]) => [field, unref(errs)])
      .filter(([, errs]) => errs.length > 0))
})
const valid = computed(() => Object.keys(errors.value).length === 0)

const form: FormInjection = {
  id: formId,
  inForm: true,
  register: (id: string, field: FormField) => {
    fields[id] = field
  },
  validate: () => {
    Object.values(fields).forEach(field => field.validate())
  },
  clear: () => {
    Object.values(fields).forEach(field => field.clear())
  },
  reset: () => {
    Object.values(fields).forEach(field => field.reset())
  },
  errors,
  valid,
}

provide<FormInjection>('form', form)
defineExpose(form)
</script>