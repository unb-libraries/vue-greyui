<template>
  <component :is="icons[name]" class="icon" />
</template>

<script lang="ts" setup>
import X from './X.vue'

defineProps<{
  name?: keyof typeof icons
}>()
const icons = {
  x: X,
}
</script>