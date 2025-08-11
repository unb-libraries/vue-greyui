<template>
  <WidgetOptionsCollection v-slot="{ id, option, selected }">
    <slot :id="id" :option="option" :selected="selected" />
  </WidgetOptionsCollection>
</template>

<script lang="ts" setup>
import { WidgetOptionsCollection } from '~/components'
</script>