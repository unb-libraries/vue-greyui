<template>
  <Story title="Clear" auto-props-disabled group="widgets" icon="lucide:square-x">
    <template #controls>
      <HstJson v-model="state.value" title="Value" />
    </template>

    <Widget v-model="state.value" class="widget">
      <InputText class="input" />
    </Widget>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Widget, InputText } from '~/components'

const state = reactive({
  value: '',
})
</script>