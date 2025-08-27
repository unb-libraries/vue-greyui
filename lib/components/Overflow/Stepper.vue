<template>
  <button
    type="button"
    @click.stop="direction === 'forward' ? onScrollForward() : onScrollBackward()"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import { OverflowInjection } from '~/components'

defineOptions({ name: 'OverflowStepper' })
const props = withDefaults(defineProps<{
  direction: 'forward' | 'backward'
  step?: number
}>(), {
  step: 100
})

const overflow = inject<OverflowInjection>('overflow')
if (!overflow) {
  throw new Error('Must be used inside an Overflow component.')
}

const { scrollPosition, scrollTo } = overflow

function onScrollForward() {
  scrollTo(scrollPosition.value + (props.step))
}

function onScrollBackward() {
  scrollTo(scrollPosition.value - (props.step))
}
</script>