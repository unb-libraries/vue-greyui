<template>
  <input
    ref="input"
    type="text"
    :id="id"
    :name="name"
    :value="value"
    @focusin="setInputCursor"
    @keydown.stop="onKey" />
</template>

<script lang="ts" setup>
import type { WidgetInjection } from '~/components'
import { computed, inject, ref, watch } from 'vue'
import { nextTick } from 'vue'

defineOptions({ name: 'InputNumber' })
const { value: model, id, name } = inject<WidgetInjection<number, 'one'>>('widget')
if (!model) {
  throw new Error('InputNumber must be used within a Widget component.');
}

const props = withDefaults(defineProps<{ format?: Intl.NumberFormat }>(), {
  format: () => new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }),
})

const value = computed(() => props.format.format(model.value ?? 0))
const input = ref<HTMLInputElement>()
const valueMap = computed(() => Object
  .entries(props.format
    .formatToParts(model.value)
    .map(({ value, type }) => value.split('').map((v) => [v, type]))
    .flat())
  .filter(([, [, t]]) => ['minusSign', 'integer', 'decimal', 'fraction'].includes(t)))
const cursorMap = computed(() => valueMap.value.filter(([, [, t]]) => !['minusSign', 'decimal'].includes(t)).map(([i]) => Number(i)))
const fractionIndex = computed(() => {
  const index = valueMap.value.filter(([, [, t]]) => !['minusSign', 'decimal'].includes(t)).findIndex(([, [, t]]) => t === 'fraction')
  return index === -1 ? valueMap.value.length : index
})
const vCursor = ref<number>(fractionIndex.value - 1)
const actualCursor = computed(() => cursorMap.value[vCursor.value ?? 0] ?? 0)
watch(actualCursor, setInputCursor)
watch(valueMap, (current, previous) => {
  if (current.filter(([, [, t]]) => t === 'integer').length > previous.filter(([, [, t]]) => t === 'integer').length) {
    vCursor.value = vCursor.value + 1
  }
})
const step = computed(() => Math.pow(10, fractionIndex.value - vCursor.value - 1))


function onKey(event: KeyboardEvent) {
  if ((/^[a-zA-Z0-9]$/.test(event.key) && !(event.ctrlKey || event.altKey || event.metaKey)) || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete'].includes(event.key)) {
    event.preventDefault()
  }

  switch (event.key) {
    case 'ArrowLeft':
      vCursor.value = Math.max(vCursor.value - 1, 0)
      break
    case 'ArrowRight':
      vCursor.value = Math.min(vCursor.value + 1, Object.keys(cursorMap.value).length - 1)
      break
    case 'ArrowUp':
      model.value = model.value + step.value
      nextTick(setInputCursor)
      break;
    case 'ArrowDown':
      model.value = model.value - step.value
      nextTick(setInputCursor)
      break;
  }
}

function setInputCursor() {
  input.value?.setSelectionRange(actualCursor.value, actualCursor.value + 1)
}
</script>