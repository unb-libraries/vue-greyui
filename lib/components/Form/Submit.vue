<template>
  <button
    type="submit"
    :disabled="strict && !form.valid?.value"
    @click="onSubmit"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { type FormInjection } from '~/components'

defineProps<{
  strict?: boolean
}>()

const form = inject<FormInjection>('form')
if (!form) {
  throw new Error('FormSubmit must be used within a Form component.')
}

function onSubmit(event: Event) {
  form.validate()
  if (!form.valid.value) {
    event.preventDefault()
  }
}
</script>