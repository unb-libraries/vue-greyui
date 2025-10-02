<template>
  <fieldset :form="formInjection.id" :class="$attrs.class || undefined">
    <slot />
  </fieldset>
</template>

<script lang="ts">
export type FormFieldInjection = {
  id: string
  name: string
}
</script>

<script lang="ts" setup>
import { inject, provide, useAttrs, useId } from 'vue'
import { FormInjection } from '~/components'

defineOptions({ name: 'FormField', inheritAttrs: false })
const { name = useId() } = useAttrs() as { name?: string }
const formInjection = inject<Pick<FormInjection, 'id'>>('form')
if (!formInjection) {
  throw new Error('FormField must be used within a Form component.')
}
provide('form-field', { id: `${formInjection.id}-${name}`, name })
</script>