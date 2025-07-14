<template>
  <InputToggle v-slot="{ state }">
    <slot :state="state">
      <slot v-if="state === 'on'" name="open" />
      <slot v-else name="closed" />
    </slot>
  </InputToggle>
</template>

<script setup lang="ts">
import { inject, onMounted, watch } from 'vue'
import { InputToggle, type WidgetInjection } from '~/components'

defineOptions({ name: 'Toggler' })
const { $el, value: open } = inject<WidgetInjection<boolean, 'one'>>('widget')

function isChildOfWidget(el: HTMLElement): boolean {
  return el === $el.value
    ? true : !el
      ? false : isChildOfWidget(el.parentElement)
}

function closeOnOutOfBoundsTarget(event: MouseEvent) {
  if (!isChildOfWidget(event.target as HTMLElement)) {
    open.value = false
  }
}

onMounted(() => {
  watch(open, open => {
    if (open) {
      window.addEventListener('focusin', closeOnOutOfBoundsTarget)
      window.addEventListener('click', closeOnOutOfBoundsTarget)
    } else {
      window.removeEventListener('focusin', closeOnOutOfBoundsTarget)
      window.removeEventListener('click', closeOnOutOfBoundsTarget)
    }
  })
})
</script>