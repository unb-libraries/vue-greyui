<template>
  <component :is="icons[name]" class="icon" />
</template>

<script lang="ts" setup>
import X from './X.vue'
import Chevron from './Chevron.vue'

defineOptions({ name: 'Icon' })
defineProps<{
  name?: keyof typeof icons
}>()
const icons = {
  x: X,
  chevron: Chevron,
}
</script>