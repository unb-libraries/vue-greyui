import { mount } from "@vue/test-utils"
import { describe, expect, test, vi } from "vitest"
import { defineComponent } from "vue"
import { useInputText } from "../useInputText"
import type { InputTextProps} from "../useInputText";
import type { Validator } from "../useInputValidation";

const InputOne = defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
      default: undefined,
    },
    cardinality: {
      type: String,
      required: false,
      default: "single",
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return useInputText(props as InputTextProps<"single">, emit, { emptyValue: '' })
  },
  template: `
    <input v-model="value" type="text" data-test="input" />
    <div data-test="value">{{ value }}</div>
  `
})

const InputMany = defineComponent({
  props: {
    modelValue: {
      type: Array<string>,
      required: false,
      default: undefined,
    },
    cardinality: {
      type: String,
      required: false,
      default: "many",
    },
    validators: {
      type: Array<Validator<string[]>>,
      required: false,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'validated'],
  setup(props, { emit }) {
    return useInputText(props as InputTextProps<"many">, emit, { emptyValue: [] })
  },
  template: `
    <input v-model="newValue" type="text" data-test="input" />
    <div data-test="value">{{ JSON.stringify(value) }}</div>
    <button data-test="add" @click.prevent="add">Add</button>
    <button data-test="remove-first" @click.prevent="remove(0)">Remove first</button>
    <button data-test="remove-last" @click.prevent="remove(-1)">Remove last</button>
  `
})

describe('useInputText', () => {
  test('set value', async () => {
    const wrapper = mount(InputOne, { props: { modelValue: 'grey' }})
    
    await wrapper.get('[data-test="input"]').setValue('dark-grey')
    
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['dark-grey'])
  })

  test('add', async () => {
    const wrapper = mount(InputMany, { props: { modelValue: ['grey'] }})
    
    await wrapper.get('[data-test="input"]').setValue('dark-grey')
    await wrapper.get('[data-test="add"]').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['grey', 'dark-grey']])
  })

  test('remove first', async () => {
    const wrapper = mount(InputMany, { props: { modelValue: ['light-grey', 'grey', 'dark-grey'] }})
    
    await wrapper.get('[data-test="remove-first"]').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['grey', 'dark-grey']])
  })

  test('remove last', async () => {
    const wrapper = mount(InputMany, { props: { modelValue: ['light-grey', 'grey', 'dark-grey'] }})
    
    await wrapper.get('[data-test="remove-last"]').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('update:modelValue')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['light-grey', 'grey']])
  })
})

