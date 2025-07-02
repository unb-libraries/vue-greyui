<template>
  <Story title="Tags" auto-props-disabled group="widgets" icon="lucide:tags">
    <template #controls>
      <HstJson v-model="state.value" title="List" />
    </template>

    <Widget v-model="state.value" cardinality="many" class="group widget gap-x-50">
      <div v-show="Object.keys(state.value).length" class="flex gap-x-25">
        <TagList v-slot="{ item }">
          <div class="flex gap-x-15 bg-accent items-center p-15 leading-[1em]">
            <div>{{ item }}</div>
            <TagListItemDelete>
              <Icon name="x" class="hover:text-accent-30" />
            </TagListItemDelete>
          </div>
        </TagList>
      </div>
      <InputTag class="input" :submit-on-blur="true" />
    </Widget>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Widget, TagList, TagListItemDelete, InputTag } from '~/components'
import { Icon } from '@playground'

const state = reactive({
  value: [],
})
</script>