<template>
  <label :for="formInjection.id">
    <slot />
  </label>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { type FormInjection } from '~/components'

defineOptions({ name: 'FormFieldLabel' })
const formInjection = inject<FormInjection>('form-field')
if (!formInjection) {
  throw new Error('FormFieldLabel must be used within a FormField component.')
}
</script>