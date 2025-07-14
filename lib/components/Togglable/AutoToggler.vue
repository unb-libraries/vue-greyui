<template>
  <Primitive v-bind="$props">
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue'
import { Primitive, type PrimitiveProps, type WidgetInjection } from '~/components'

defineProps<PrimitiveProps>()
const { $el, value: open } = inject<WidgetInjection<boolean, 'one'>>('widget')
if (!open) {
  throw new Error('Toggler must be used within a Togglable component.')
}

onMounted(() => {
  const el = $el.value
  el.addEventListener('mouseenter', () => open.value = true)
  el.addEventListener('mouseleave', () => open.value = false)
  el.addEventListener('focusin', () => open.value = true)
  el.addEventListener('focusout', () => open.value = false)
})
</script>