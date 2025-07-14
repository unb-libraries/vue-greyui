<template>
  <RekaPrimitive ref="primitive" :as="as" :as-child="asChild">
    <slot />
  </RekaPrimitive>
</template>

<script lang="ts" setup>
import { Primitive as RekaPrimitive, type PrimitiveProps as RekaPrimitiveProps } from 'reka-ui'
import { ref } from 'vue'

export type PrimitiveProps = RekaPrimitiveProps

defineProps<RekaPrimitiveProps>()

const primitive = ref<HTMLElement>()
defineExpose({ el: primitive })
</script>