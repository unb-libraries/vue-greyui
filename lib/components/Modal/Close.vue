<template>
  <InputToggle>
    <slot />
  </InputToggle>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { InputToggle, type WidgetInjection } from '~/components'

defineOptions({ name: 'ModalClose' })
const { value: open } = inject<WidgetInjection<boolean, 'one'>>('widget')
if (!open) {
  throw new Error('ModalClose must be used within a Modal component.')
}
</script>