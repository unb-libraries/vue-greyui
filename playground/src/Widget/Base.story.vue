<template>
  <Story title="Base" auto-props-disabled group="widgets">
    <template #controls>
      <HstJson v-model="state.value" title="Value" />
      <HstCheckbox v-model="state.validate.required" title="Required" />
    </template>

    <Widget v-model="state.value" :validators="{ required }" class="widget data-[invalid]:border-red">
      <InputText class="input" />
    </Widget>
  </Story>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { Widget, InputText } from '~/components'

const required = computed(() => state.validate.required && ((value: string) => !!value))
const state = reactive({
  value: '',
  validate: {
    required: false,
  },
})
</script>