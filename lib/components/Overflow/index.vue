<template>
  <Primitive
    :as="as"
    :data-orientation="orientation"
    :data-status="status"
  >
    <slot
      :orientation="orientation"
      :status="status"
      :scrollPosition="scrollPosition"
      :items="items" />
  </Primitive>
</template>

<script lang="ts">
export type Orientation = 'horizontal' | 'vertical'
export type OverflowInjection = {
  scrollPosition: Ref<number>,
  scrollTo: (pos: number) => void,
  orientation: Orientation
  content: Ref<Element | undefined>
  items: Ref<Element[] | undefined>
  status: Ref<'start' | 'end' | 'scrolling'>
}
</script>

<script lang="ts" setup>
import { computed, provide, ref, type Ref } from 'vue'
import { Primitive, type PrimitiveProps } from '~/components'

defineOptions({ name: 'Overflow' })
const props = withDefaults(defineProps<Pick<PrimitiveProps, 'as'> & {
  orientation?: Orientation
}>(), {
  orientation: 'horizontal',
})

const scrollPosition = ref<number>(0)
const content = ref<Element>()
const items = ref<Element[]>()

const status = computed(() => {
  const el = content.value
  if (!el) return 'start'
  const max = props.orientation === 'horizontal'
    ? el.scrollWidth - el.clientWidth
    : el.scrollHeight - el.clientHeight
  if (scrollPosition.value === 0) return 'start'
  if (scrollPosition.value >= max) return 'end'
  return 'scrolling'
})

function scrollTo(pos: number) {
  if (props.orientation === 'horizontal') {
    content.value.scrollTo({ left: pos, behavior: 'smooth' })
  } else {
    content.value.scrollTo({ top: pos, behavior: 'smooth' })
  }
}

provide<OverflowInjection>('overflow', {
  scrollPosition,
  scrollTo,
  orientation: props.orientation,
  content,
  items,
  status,
})
</script>