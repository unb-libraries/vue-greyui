<template>
  <Story title="Overflow" group="content" auto-props-disabled icon="lucide:scroll-text">
    <template #controls>
      <HstSelect v-model="step" :options="['page', 'end', 'element', 'fixed']" title="Step mode" />
      <HstSlider v-if="step === 'fixed'" v-model="stepSize" :min="50" :max="500" :step="50" title="Step size" />
      <HstSlider v-model="stepOffset" :min="0" :max="100" :step="1" title="Step offset" />
    </template>
    
    <Overflow
      orientation="vertical"
      class="group flex flex-col gap-y-50 w-full h-fit p-100 bg-base-34 text-base-84 rounded-25"
      v-slot="{ status }"
    >
      <div class="relative h-1600">
        <div class="absolute group-data-[status=start]:hidden top-0 h-400 w-full bg-gradient-to-b from-base-34 to-transparent" />
        <div class="absolute group-data-[status=end]:hidden bottom-0 h-400 w-full bg-gradient-to-t from-base-34 to-transparent" />
        <OverflowContent class="group h-full space-y-100 scrollbar-thin scrollbar-thumb-transparent group-hover:scrollbar-thumb-base-24/70 scrollbar-track-transparent">
          <h1 class="text-2xl font-black">Documentation</h1>
          <section>
            <h2 class="text-lg font-bold mb-50">Introduction</h2>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla porro ab dolores ipsum dolorum earum dignissimos sint pariatur, dolor doloribus sed incidunt, magni et, cumque consequatur quis. Aliquid, impedit excepturi.</p>
          </section>
          <section>
            <h2 class="text-lg font-bold mb-50">Building your first "Hello World" app</h2>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
          </section>
          <section>
            <h2 class="text-lg font-bold mb-50">Advanced features</h2>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
          </section>
          <section>
            <h2 class="text-lg font-bold mb-50">Testing</h2>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
          </section>
          <section>
            <h2 class="text-lg font-bold mb-50">Getting help</h2>
            <p class="mb-100">Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis quod architecto sed placeat. Nisi odit maiores hic recusandae amet inventore obcaecati minima corporis dolor molestias dignissimos quae consequuntur, autem quibusdam.</p>
          </section>
        </OverflowContent>
      </div>
      <div class="flex justify-center gap-x-25">
        <OverflowStepper
          direction="forward"
          :step="((step !== 'fixed' ? step : stepSize) as 'page' | number)"
          :step-offset="stepOffset"
          :disabled="status === 'end'"
          class="disabled:text-base-44 p-50 bg-base-44 disabled:bg-base-54 rounded-25"
        >
          <Icon name="chevron" class="rotate-180" />
        </OverflowStepper>
        <OverflowStepper
          direction="backward"
          :step="((step !== 'fixed' ? step : stepSize) as 'page' | number)"
          :step-offset="stepOffset"
          :disabled="status === 'start'"
          class="disabled:text-base-44 p-50 bg-base-44 disabled:bg-base-54 rounded-25"
        >
          <Icon name="chevron" />
        </OverflowStepper>
      </div>
    </Overflow>
  </Story>
</template>

<script lang="ts" setup>
import { Icon } from '@playground'
import { ref } from 'vue'
import { Overflow, OverflowContent, OverflowStepper } from '~/components'

const step = ref('fixed')
const stepSize = ref(100)
const stepOffset = ref(0)
</script>