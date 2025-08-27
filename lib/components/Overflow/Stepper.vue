<template>
  <button
    type="button"
    @click.stop="direction === 'forward' ? onScrollForward() : onScrollBackward()"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { OverflowInjection } from '~/components'

defineOptions({ name: 'OverflowStepper' })
const props = withDefaults(defineProps<{
  direction: 'forward' | 'backward'
  step?: 'page' | 'end' | number
}>(), {
  step: 100
})

const overflow = inject<OverflowInjection>('overflow')
if (!overflow) {
  throw new Error('Must be used inside an Overflow component.')
}

const { scrollPosition, scrollTo, content, orientation } = overflow

const stepSize = computed(() => {
  switch (props.step) {
    case 'page': {
      const overflowEdge = orientation === 'horizontal' ? 'width' : 'height'
      return content.value.getBoundingClientRect()[overflowEdge]
    }
    case 'end': {
      const overflowEdge = orientation === 'horizontal' ? 'scrollWidth' : 'scrollHeight'
      return content.value[overflowEdge]
    }
    default: {
      return props.step
    }
  }
})

function onScrollForward() {
  scrollTo(scrollPosition.value + stepSize.value)
}

function onScrollBackward() {
  scrollTo(scrollPosition.value - stepSize.value)
}
</script>