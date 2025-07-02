<template>
  <Widget as-child v-model="tag" :validators="validators">
    <InputText
      @keydown.enter.prevent="submit"
      @blur="submitOnBlur && submit()" />
  </Widget>
</template>

<script lang="ts" setup>
import { inject, ref, watch } from 'vue'
import { Widget, InputText, type WidgetInjection, WidgetProps } from '~/components'

defineOptions({ name: 'InputTag' })
defineProps<WidgetProps<string, 'one'> & {
  submitOnBlur?: boolean
}>()

const tag = ref<string>()
const { add, value } = inject<WidgetInjection<string, 'many'>>('widget')
if (!value || !add) {
  throw new Error('InputTag must be used inside a Widget component')
}

function submit() {
  if (tag.value) {
    add(tag.value)
  }
}

watch(value, (newValue, prev) => {
  if (Object.values(newValue).length === Object.values(prev).length + 1) {
    tag.value = ''
  }
})
</script>