import { mount } from "@vue/test-utils"
import { describe, expect, test } from "vitest"
import { defineComponent } from "vue"
import { type InputNumberOptions, useInputNumber } from "../useInputNumber"

/*
Number input
- normalized input, e.g. .5 => 0.5
- fixed decimals, e.g. 5 => 5.00
- min,max, e.g. min 0, max 10, input -1, output 0, changing input from 9 to 15, output 9
- default step size, e.g. 5 + 1 + 1 = 7; 5.1 + 1 + 1 = 7.1
- multiple step sizes, [1, 5, 10]
- smaller first step, e.g. 5.12 + 1 + 1 = 7; 5.12 + 0.1 + 0.1 = 5.3; -5.12 + 0.1 + 0.1 = -5.00
- accelerate steps, e.g. 7 + 1 + 1 + 1 + 10 = 20
*/


const Input = (options?: Partial<InputNumberOptions>) => defineComponent({
  props: {
    modelValue: {
      type: Number,
      required: false,
      default: undefined,
    },
    decimals: {
      type: Number,
      required: false,
      min: 0,
      default: () => 0,
    },
    steps: {
      type: Array<number>,
      required: false,
      default: () => [1],
    }
  },
  setup(props, { emit }) {
    return useInputNumber(props, emit, options)
  },
  template: `
    <input v-model="displayValue" type="number" data-test="input-number" />
    <input v-model="displayValue" type="text" data-test="input-text" />
    <div data-test="value">{{ value }}</div>
    <div data-test="display-value">{{ displayValue }}</div>
    <button data-test="inc" @click.prevent="stepUp()">Step Up</button>
    <button data-test="incL" @click.prevent="stepUp(1)">Large Step Up</button>
    <button data-test="dec" @click.prevent="stepDown()">Step Down</button>
    <button data-test="decL" @click.prevent="stepDown(1)">Large Step Down</button>
  `
})

describe('useInputNumber', () => {
  test('should normalize numeric display value', async () => {
    const wrapper = mount(Input(), { props: { decimals: 1, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
    
    await wrapper.get('[data-test="input-number"]').setValue("0.5")
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("0.5")
    
    
    await wrapper.get('[data-test="input-number"]').setValue(".5")
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("0.5")
    
    await wrapper.get('[data-test="input-number"]').setValue("-.5")
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("-0.5")
    
    await wrapper.setProps({ decimals: 2 })
    await wrapper.get('[data-test="input-number"]').setValue("0.5")
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("0.50")
    
    await wrapper.setProps({ decimals: 0 })
    await wrapper.get('[data-test="input-number"]').setValue("05")
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("5")
    
    await wrapper.get('[data-test="input-number"]').setValue("-05")
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("-5")
  })

  test('should reject non-numeric display values', async () => {
    const wrapper = mount(Input(), { props: { modelValue: 0, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) } })

    // "a" => no update
    await wrapper.get('[data-test="input-number"]').setValue('a')
    await wrapper.get('[data-test="input-text"]').setValue('a')
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("0")
  })

  test('should accept decimals between 0-20', async () => {
    const wrapper = mount(Input(), { props: { modelValue: 1 } })
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("1")

    await wrapper.setProps({ decimals: 3 })
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("1.000")
    
    await wrapper.setProps({ decimals: 21 })
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("1.00000000000000000000")
    
    await wrapper.setProps({ decimals: -1 })
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("1")
  })

  test('fixed stepping', async () => {
    const wrapper = mount(Input({ round: false }), { props: { steps: [0.2, 1.5], decimals: 1, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) } })

    // undefined + 0.2 + 1.5 - 0.2 - 0.2 - 1.5 - 0.2 + 1.5 === 1.1
    await wrapper.get('[data-test="inc"]').trigger('click')
    await wrapper.get('[data-test="incL"]').trigger('click')
    await wrapper.get('[data-test="dec"]').trigger('click')
    await wrapper.get('[data-test="dec"]').trigger('click')
    await wrapper.get('[data-test="decL"]').trigger('click')
    await wrapper.get('[data-test="dec"]').trigger('click')
    await wrapper.get('[data-test="incL"]').trigger('click')
    
    expect(wrapper.props("modelValue")).toBe(1.1)
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("1.1")
  })

  test('rounded stepping', async () => {
    const wrapper = mount(Input({ round: true }), { props: { modelValue: 0.1, steps: [0.2, 1.5], decimals: 1, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) } })

    // 0.1 + 0.2 + 1.5 + 1.5  === 3.0
    await wrapper.get('[data-test="inc"]').trigger('click')
    await wrapper.get('[data-test="incL"]').trigger('click')
    await wrapper.get('[data-test="incL"]').trigger('click')

    expect(wrapper.props("modelValue")).toBe(3)
    expect(wrapper.get('[data-test="display-value"]').text()).toBe("3.0")
  })
})
