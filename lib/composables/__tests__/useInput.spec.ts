import { mount } from "@vue/test-utils"
import { describe, expect, it, test } from "vitest"
import { defineComponent } from "vue"
import useInput from "../useInput"

const Input = defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return useInput(props, emit, { emptyValue: '' })
  },
  template: `
    <input v-model="value" type="text" data-test="input" />
    <div data-test="value">{{ value }}</div>
    <button data-test="clear" @click.prevent="clear">Clear</button>
    <button data-test="unset" @click.prevent="unset">Unset</button>
  `
})

describe('useInput', () => {
  test('value', async () => {
    const wrapper = mount(Input, { props: { modelValue: undefined, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
    for (const char of "grey") {
      await wrapper.get('[data-test="input"]').setValue((wrapper.props("modelValue") ?? "") + char)
    }
    expect(wrapper.props("modelValue")).toBe('grey')
  })


  test('clear value', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'grey', "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
    
    await wrapper.get('[data-test="clear"]').trigger('click')
    expect(wrapper.props("modelValue")).toBe('')
  })

  describe('unset value', () => {
    it('should reset to null if initially not empty', async () => {
      const wrapper = mount(Input, { props: { modelValue: 'grey', "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
      
      await wrapper.get('[data-test="unset"]').trigger('click')
      expect(wrapper.props("modelValue")).toBe(null)
    })
    
    it('should reset to undefined if initially empty', async () => {
      const wrapper = mount(Input, { props: { modelValue: undefined, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
      
      await wrapper.get('[data-test="input"]').setValue('grey')
      await wrapper.get('[data-test="unset"]').trigger('click')
      expect(wrapper.props("modelValue")).toBe(undefined)
    })
  })
})