<template>
  <Primitive
    ref="el"
    :as="as"
    :as-child="asChild"
    :data-status="status"
    :style="orientation === 'horizontal' ? { overflowX: 'scroll' } : { overflowY: 'scroll' }"
    @scroll="onScroll"
  >
    <slot />
  </Primitive>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue'
import { Primitive, type PrimitiveProps } from '~/components'
import { type OverflowInjection } from '~/components'

defineOptions({ name: 'OverflowContent' })

defineProps<PrimitiveProps>()
const el = ref<{ el: { $el: Element } }>()
const overflow = inject<OverflowInjection>('overflow')
if (!overflow) {
  throw new Error('Must be used inside an Overflow component.')
}

const { scrollPosition, orientation, content, status } = overflow

function onScroll(event: Event) {
  scrollPosition.value = orientation === 'horizontal'
    ? (event.target as HTMLElement).scrollLeft
    : (event.target as HTMLElement).scrollTop
}

onMounted(() => content.value = el.value.el.$el)
</script>