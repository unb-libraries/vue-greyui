<template>
  <input
    type="text"
    v-model="value"
    :id="id"
    :name="name"
    @input="onInput()"
    @blur="onBlur()" />
</template>

<script lang="ts" setup>
import type { WidgetInjection } from '~/components'
import { inject, ref, watch } from 'vue'

defineOptions({ name: 'InputText' })
const props = withDefaults(defineProps<{
  updateOn?: 'input' | 'unfocus'
}>(), {
  updateOn: 'input',
})

const { value: model, id, name } = inject<WidgetInjection<string, 'one'>>('widget')
if (!model) {
  throw new Error('InputText must be used within a Widget component.');
}

const value = ref(model.value)
watch(model, (newValue) => value.value = newValue)

function onInput() {
  if (props.updateOn === 'input') {
    model.value = value.value
  }
}

function onBlur() {
  if (props.updateOn === 'unfocus') {
    model.value = value.value
  }
}
</script>