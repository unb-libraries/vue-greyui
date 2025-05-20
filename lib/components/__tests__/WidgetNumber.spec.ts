import { WidgetNumber } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  emits: ['input', 'clear', 'validate'],
  setup(_, { emit }) {
    return {
      onInput(value: string) {
        const numericValue = Number(value)
        if (!isNaN(numericValue)) {
          emit('input', numericValue)
        }
      }
    }
  },
  template: `
    <div>
      <input type="text" data-test="input" @input="onInput($event.target.value)" />
      <button data-test="clear" @click.prevent="$emit('clear')" />
    </div>
  `
})

describe('InputNumber', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetNumber, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        valid: undefined,
        error: undefined,
        'onUpdate:modelValue': (newValue: number) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      }
    })
    return widget
  }


  describe('set value', async () => {
    test('within range', async () => {
      const input = mountWidget()
      await input.get('[data-test="input"]').setValue("1")
      expect(input.props().modelValue).toBe(1)
    })

    test('out of range', async () => {
      const input = mountWidget({ modelValue: 0, min: 0, max: 10 })
      await input.get('[data-test="input"]').setValue("-1")
      expect(input.props().modelValue).toBe(0)
      await input.get('[data-test="input"]').setValue("11")
      expect(input.props().modelValue).toBe(10)
    })
    
    test('not a number', async () => {
      const input = mountWidget({ modelValue: 2 })
      await input.get('[data-test="input"]').setValue("A")
      expect(input.props().modelValue).toBe(2)
    })
    
  })

  describe('clear value', async () => {
    it('should yield "null" when initialized', async () => {
      const input = mountWidget({ modelValue: 1 })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    it('should yield "" when NOT initialized', async () => {
      const input = mountWidget()
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(0)
    })
  })
})
