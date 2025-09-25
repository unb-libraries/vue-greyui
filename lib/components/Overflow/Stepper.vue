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
  step?: 'page' | 'end' | 'element' | number
  stepOffset?: number
}>(), {
  step: 100,
  stepOffset: 0
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
    case 'element': {
      const targetEdge = orientation === 'horizontal' ? 'left' : 'top'
      const getTargetElement = () => {
        const targetEdge = orientation === 'horizontal' ? ['left', 'right'] : ['top', 'bottom']
        const contentBounds = content.value.getBoundingClientRect()
        const contentElements = Array
          .from(content.value.childNodes.values() ?? [])
          .filter(node => node.nodeType === Node.ELEMENT_NODE) as Element[]

        const findFirstInvisible = (node: Element) => {
          const bounds = (node as Element).getBoundingClientRect()
          return props.direction === 'forward'
            ? bounds[targetEdge[0]] > contentBounds[targetEdge[0]] && bounds[targetEdge[1]] > contentBounds[targetEdge[1]]
            : bounds[targetEdge[0]] < contentBounds[targetEdge[0]] && bounds[targetEdge[1]] < contentBounds[targetEdge[1]]
        }

        return props.direction === 'forward'
          ? contentElements.find(findFirstInvisible)
          : contentElements.reverse().find(findFirstInvisible)
      }

      return () => {
        const targetElement = getTargetElement()
        return Math.abs(targetElement?.getBoundingClientRect()[targetEdge] - content.value.getBoundingClientRect()[targetEdge])
      }
    }
    default: {
      return props.step
    }
  }
})

function onScrollForward() {
  scrollTo(scrollPosition.value + (typeof stepSize.value === 'function' ? stepSize.value() : stepSize.value) - props.stepOffset)
}

function onScrollBackward() {
  scrollTo(scrollPosition.value - (typeof stepSize.value === 'function' ? stepSize.value() : stepSize.value) - props.stepOffset)
}
</script>