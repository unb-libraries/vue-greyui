<template>
  <WidgetOptionsCollection v-slot="{ option, selected }">
    <InputToggle v-slot="{ state }" :disabled="selected" v-bind="$attrs">
      <slot :option="option" :state="state" />
    </InputToggle>
  </WidgetOptionsCollection>
</template>

<script setup lang="ts">
import { InputToggle, WidgetOptionsCollection } from '~/components'

defineOptions({ name: 'TabList', inheritAttrs: false })
</script>