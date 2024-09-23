<template>
  <button @click.stop.prevent="count++">Count {{ count }}</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const count = ref(0)
</script>