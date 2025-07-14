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
  const root = $el.value

  const openHandler = () => open.value = true
  const closeHandler = () => open.value = false

  root.addEventListener('mouseenter', openHandler)
  root.addEventListener('mouseleave', closeHandler)
  root.addEventListener('focusin', openHandler)
  root.addEventListener('focusout', closeHandler)
})
</script>