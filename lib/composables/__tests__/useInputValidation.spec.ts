import { mount } from "@vue/test-utils"
import { describe, expect, test, vi } from "vitest"
import { defineComponent, useModel } from "vue"
import { useInputValidation } from "../useInputValidation"
import type { Validator } from "../useInputValidation"

const Input = defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
    },
    validators: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  data({ $props }) {
    const input = { value: useModel($props, 'modelValue'), clear: vi.fn(() => {}), unset: vi.fn(() => {}) }
    const { value, error, valid } = useInputValidation(input, $props.validators as Validator<string>[])
    return {
      value,
      valid,
      error,
    }
  },
  template: `
    <input v-model="value" type="text" data-test="input" />
    <div data-test="value">{{ value }}</div>
    <div data-test="valid">
      {{ valid !== undefined && valid ? "valid" : valid !== undefined ? "invalid" : "" }}
    </div>
    <div data-test="error">
      {{ error }}
    </div>
  `
})

describe('useInput', () => {
  test('validate', async () => {
    const validator = vi.fn((value: string) => value === 'grey' ? true : 'Value must be "grey"')
    const wrapper = mount(Input, {
      props: {
        modelValue: undefined,
        validators: [validator]
      },
    })
    
    await wrapper.setProps({ modelValue: 'dark-grey' })
    
    expect(wrapper.get('[data-test="value"]').text()).toBe('dark-grey')
    expect(wrapper.get('[data-test="valid"]').text()).toBe('invalid')
    expect(wrapper.get('[data-test="error"]').text()).toBe('Value must be "grey"')

    await wrapper.setProps({ modelValue: 'grey' })
    
    expect(wrapper.get('[data-test="value"]').text()).toBe('grey')
    expect(wrapper.get('[data-test="valid"]').text()).toBe('valid')
    expect(wrapper.get('[data-test="error"]').text()).toBe('')
  })
})