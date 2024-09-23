<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="grid grid-cols-6 gap-8 pb-8 h-full overflow-y-scroll">
    <div v-for="(_, index) in Array.from({ length: 24 })"
      class="dark:bg-slate-600 bg-slate-200 border-slate-300 border dark:border-slate-500 rounded-xl p-6">
      <HelloWorld />
    </div>
  </div>
</template>
