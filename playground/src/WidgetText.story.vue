<template>
  <Story title="Text" auto-props-disabled group="widgets">
    <Variant title="Input" icon="lucide:text-cursor-input">
      <template #controls>
        <HstTextarea v-model="state.name" title="Name" />
        <HstCheckbox v-model="state.submitOnBlur" title="Submit on blur" />
      </template>
      
      <Widget
        v-model="state.name"
        :validators="{ pattern: validators.pattern }"
        class="widget data-[invalid]:border-red data-[invalid]:text-red"
      >
        <InputText class="input"
          :update-on="state.submitOnBlur ? 'unfocus' : 'input'" />
        <WidgetClear class="clear" />
      </Widget>
    </Variant>

    <Variant title="Tags" icon="lucide:tags">
      <template #controls>
        <HstCheckbox v-model="state.submitOnBlur" title="Submit on blur" />
        <HstJson v-model="state.list" title="List" :disabled="true" />
      </template>

      <Widget
        v-model="state.list"
        cardinality="many"
        :validators="{ unique: validators.unique }"
        class="group widget gap-x-50"
        v-slot="{ clearError }"
      >
        <div v-show="Object.keys(state.list).length" class="flex gap-x-25">
          <TagList v-slot="{ item }">
            <div class="flex gap-x-15 bg-accent items-center p-15 leading-[1em]">
              <div>{{ item }}</div>
              <TagListItemDelete>
                <Icon name="x" class="hover:text-accent-30" />
              </TagListItemDelete>
            </div>
          </TagList>
        </div>
        <InputTag class="input data-[error=pattern]:text-yellow group-data-[error~=unique]:text-yellow"
          :validators="{ pattern: validators.pattern }"
          @input="clearError('unique')"
          @blur.stop="$nextTick(() => clearError('unique'))"
          :submit-on-blur="state.submitOnBlur" />
        <WidgetClear class="clear" />
      </Widget>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { Widget, InputText, WidgetClear, TagList, TagListItemDelete, InputTag } from '~/components'
import Icon from './Icon/index.vue'

const validators = {
  pattern: (value: string) => !value || /^[A-Z]/.test(value),
  unique: (value: string[]) => value.every((v, i, a) => a.indexOf(v) === i),
}

const state = reactive({
  name: '',
  list: [],
  submitOnBlur: false,
})
</script>