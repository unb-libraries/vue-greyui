<template>
  <Story title="Modal" group="content" auto-props-disabled icon="lucide:container">
    <template #controls>
      <HstJson v-model="open" title="Open" />
    </template>
    
    <div id="modals" />
    <Widget v-model="open">
      <p class="text-base-84 p-100 container mx-auto">
        If you read this text carefully, you will find a <InputToggle class="inline text-accent-50 hover:text-accent-70 underline">hint</InputToggle> on how to open a modal.
      </p>
    </Widget>
    <Modal v-model="open" container="#modals" class="flex justify-center items-center bg-base-14/60">
      <div class="w-1/2 mx-auto space-y-50 flex flex-col justify-center">
        <div class="flex w-full justify-end">
          <ModalClose class="text-base-74 hover:text-base-84 underline">
            Close
          </ModalClose>
        </div>
        <div class="flex flex-col p-100 bg-base-34 rounded-25">
          <p class="text-base-74 mb-100">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi corporis ea dolorem. Accusamus expedita in, possimus adipisci magnam exercitationem corrupti saepe. Beatae exercitationem culpa dolore. Iure harum rerum nulla nesciunt.
          </p>
          <ModalClose class="bg-accent hover:bg-accent-60 text-base-94 rounded-25 leading-[1.5em] px-50r py-25r">OK</ModalClose>
        </div>
      </div>
    </Modal>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { InputToggle, Modal, ModalClose, Widget } from '~/components'

const open = ref(false)
</script>