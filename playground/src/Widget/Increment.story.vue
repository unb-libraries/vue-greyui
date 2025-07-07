<template>
  <Story title="Increment" auto-props-disabled group="widgets" icon="lucide:triangle-right">
    <template #controls>
      <HstJson v-model="state.value" title="Value" />
      <HstSlider v-model="state.step" title="Step" />
    </template>
    
    <Widget v-model="state.value" class="widget gap-x-25">
      <div class="flex grow">{{ state.value }}</div>
      <WidgetIncrement :step="state.step" class="bg-base-44 hover:bg-base-54 text-base-84 rounded-25 flex items-center justify-center p-15">
        <Icon name="chevron" />
      </WidgetIncrement>
      <WidgetIncrement :step="-state.step" class="bg-base-44 hover:bg-base-54 text-base-84 rounded-25 flex items-center justify-center p-15">
        <Icon name="chevron" class="rotate-180" />
      </WidgetIncrement>
    </Widget>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Widget, WidgetIncrement } from '~/components'
import { Icon } from '@playground'

const state = reactive({
  value: 0,
  step: 1,
})
</script>