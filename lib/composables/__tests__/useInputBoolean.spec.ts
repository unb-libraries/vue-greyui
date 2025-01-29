import { mount } from "@vue/test-utils"
import { describe, expect, test } from "vitest"
import { defineComponent } from "vue"
import { useInputBoolean } from "../useInputBoolean"

const Input = defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return useInputBoolean(props, emit)
  },
  template: `
    <input type="checkbox" v-model="value" data-test="input" @change="toggle" />
  `
})

describe('useInputBoolean', () => {
  test('toggle', async () => {
    const wrapper = mount(Input, { props: { modelValue: undefined }})
    
    await wrapper.get('[data-test="input"]').trigger('change')
    await wrapper.setProps({ modelValue: true })
    await wrapper.get('[data-test="input"]').trigger('change')

    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    expect(wrapper.emitted('update:modelValue')[1]).toEqual([false])
  })
})