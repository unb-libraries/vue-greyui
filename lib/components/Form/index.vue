<template>
  <form :id="formId">
    <slot :formId="formId" />
  </form>
</template>

<script lang=ts>
export type Validation = {
  valid: boolean
  errors: string[]
}
export type FormInjection = {
  id: string
  inForm: boolean
}
</script>

<script lang="ts" setup>
import { provide, reactive, useAttrs, useId } from 'vue'

defineOptions({ name: 'Form' })
const formId = useAttrs().id as string ?? `form-${useId()}`

provide<FormInjection>('form', {
  id: formId,
  inForm: true,
})
</script>