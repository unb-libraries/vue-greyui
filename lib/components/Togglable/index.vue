<template>
  <Widget
    ref="widget"
    :as="as"
    :as-child="false"
    :model-value="modelValue"
    :style="{ position: 'relative', overflow: 'visible' }"
    :data-state="state"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </Widget>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { Widget, type WidgetInterface, type WidgetProps } from '~/components'

export type TogglableProps = Omit<WidgetProps<boolean, 'one'>, 'asChild'>

defineOptions({ name: 'Togglable' })
const open = defineModel<boolean>({ required: false })
defineProps<TogglableProps>()

const widget = ref<WidgetInterface<boolean, 'one'>>()
const state = computed(() => open.value ? 'open' : 'closed')

function isChildOfWidget(el: HTMLElement): boolean {
  return el === widget.value.$el as unknown as HTMLElement
    ? true : !el
      ? false : isChildOfWidget(el.parentElement)
}

function closeOnOutOfBoundsTarget(event: MouseEvent) {
  if (!isChildOfWidget(event.target as HTMLElement)) {
    open.value = false
  }
}

watch(open, open => {
  if (open) {
    window.addEventListener('focusin', closeOnOutOfBoundsTarget)
    window.addEventListener('click', closeOnOutOfBoundsTarget)
  } else {
    window.removeEventListener('focusin', closeOnOutOfBoundsTarget)
    window.removeEventListener('click', closeOnOutOfBoundsTarget)
  }
})
</script>