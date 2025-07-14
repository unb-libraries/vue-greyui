<template>
  <Primitive v-bind="$props">
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { inject, onMounted } from 'vue'
import { Primitive, type PrimitiveProps, type WidgetInjection } from '~/components'

const props = defineProps<PrimitiveProps & {
  delay?: number
}>()
const { $el, value: open } = inject<WidgetInjection<boolean, 'one'>>('widget')
if (!open) {
  throw new Error('Toggler must be used within a Togglable component.')
}

onMounted(() => {
  const root = $el.value

  let handler: ReturnType<typeof setTimeout>
  const openHandler = () => handler = setTimeout(() => open.value = true, props.delay ?? 0)
  const closeHandler = () => { clearTimeout(handler); open.value = false }

  root.addEventListener('mouseenter', openHandler)
  root.addEventListener('mouseleave', closeHandler)
  root.addEventListener('focusin', openHandler)
  root.addEventListener('focusout', closeHandler)
})
</script>