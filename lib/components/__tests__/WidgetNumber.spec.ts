import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'
import { WidgetNumber } from '../../components'

const Layout = defineComponent({
  props: {
    value: {
      type: Array<Number>,
      required: false,
      default: undefined,
    },
    error: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['input', 'clear', 'validate'],
  setup(_, { emit }) {
    return {
      onInput(value: string) {
        const numbers = value.split(',').map(Number)
        if (!numbers.some(isNaN)) {
          emit('input', numbers)
        }
      }
    }
  },
  template: `
    <div>
      <input type="text" data-test="input" @input.stop="onInput($event.target.value)" />
      <button data-test="clear" @click.prevent="$emit('clear')" />
      <button data-test="validate" @click.prevent="$emit('validate')" />
      <div data-test="error">{{ error }}</div>
    </div>
  `
})

describe('InputNumber', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetNumber, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        'onUpdate:modelValue': (newValue: number) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      }
    })
    return widget
  }

  describe('Single-value', async () => {
    test('set', async () => {
      const input = mountWidget()
      await input.get('[data-test="input"]').setValue("1")
      expect(input.props().modelValue).toBe(1)
      
      await input.get('[data-test="input"]').setValue("A")
      expect(input.props().modelValue).toBe(1)
    })

    describe('clear', async () => {
      test('initialized', async () => {
        const input = mountWidget({ modelValue: 1 })
        await input.get('[data-test="clear"]').trigger('click')
        expect(input.props().modelValue).toBe(null)
      })
      
      test('uninitialized', async () => {
        const input = mountWidget()
        await input.get('[data-test="clear"]').trigger('click')
        expect(input.props().modelValue).toBe(0)
      })
    })
  
    test('validate', async () => {
      const input = mountWidget({ min: 1, max: 1, floor: 0, ceil: 10 })
      
      await input.get('[data-test="validate"]').trigger("click")
      expect(input.get('[data-test="error"]')).not.toBe("")
      
      await input.get('[data-test="input"]').setValue("-1")
      expect(input.props().modelValue).toBe(0)
      await input.get('[data-test="input"]').setValue("11")
      expect(input.props().modelValue).toBe(10)
    })
  })

  describe('Multi-value', async () => {
    test('set', async () => {
      const input = mountWidget({ cardinality: 'many' })
      await input.get('[data-test="input"]').setValue("1,2")
      expect(input.props().modelValue).toEqual([1, 2])
      
      await input.get('[data-test="input"]').setValue("A, 10")
      expect(input.props().modelValue).toEqual([1, 2])
    })

    describe('clear', async () => {
      test('initialized', async () => {
        const input = mountWidget({ modelValue: [1], cardinality: 'many' })
        await input.get('[data-test="clear"]').trigger('click')
        expect(input.props().modelValue).toBe(null)
      })
      
      test('uninitialized', async () => {
        const input = mountWidget({ cardinality: 'many' })
        await input.get('[data-test="clear"]').trigger('click')
        expect(input.props().modelValue).toEqual([])
      })
    })
  
    test('validate', async () => {
      const input = mountWidget({ min: 1, max: 1, floor: 0, ceil: 10 })
      
      await input.get('[data-test="validate"]').trigger("click")
      expect(input.get('[data-test="error"]')).not.toBe("")
      
      await input.get('[data-test="input"]').setValue("-1")
      expect(input.props().modelValue).toBe(0)
      await input.get('[data-test="input"]').setValue("11")
      expect(input.props().modelValue).toBe(10)
    })
  })
})
