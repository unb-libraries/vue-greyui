<template>
  <InputToggle v-slot="{ state }">
    <slot :state="state">
      <slot v-if="state === 'on'" name="open" />
      <slot v-else name="closed" />
    </slot>
  </InputToggle>
</template>

<script setup lang="ts">
import { InputToggle } from '~/components'
defineOptions({ name: 'Toggler' })
</script>