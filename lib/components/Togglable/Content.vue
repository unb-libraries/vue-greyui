<template>
  <Primitive v-if="open" :as="as">
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { Primitive, PrimitiveProps, WidgetInjection } from '~/components'

export type TogglableContentProps = Pick<PrimitiveProps, 'as'>

defineOptions({ name: 'TogglableContent' })
defineProps<TogglableContentProps>()
const { value: open } = inject<WidgetInjection<boolean, 'one'>>('widget')
if (!open) {
  throw new Error('TogglableContent must be used within a Togglable component.')
}
</script>