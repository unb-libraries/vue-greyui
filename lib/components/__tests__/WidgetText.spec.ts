import { WidgetText } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'

const Layout = defineComponent({
  props: {
    value: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  emits: ['input', 'clear', 'validate'],
  setup() { return {} },
  template: `
    <div>
      <input type="text" data-test="input" @input="$emit('input', $event.target.value)" />
      <button data-test="clear" @click.prevent="$emit('clear')" />
    </div>
  `
})

describe('InputText', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetText, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        valid: undefined,
        error: undefined,
        'onUpdate:modelValue': (newValue: string) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      },
    })
    return widget
  }
  
  test('set value', async () => {
    const input = mountWidget()
    await input.get('[data-test="input"]').setValue("Grey")
    expect(input.props().modelValue).toBe("Grey")
  })

  describe('clear value', async () => {
    it('should yield "null" when initialized', async () => {
      const input = mountWidget({ modelValue: 'Grey',  })
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe(null)
    })
    
    it('should yield "" when NOT initialized', async () => {
      const input = mountWidget()
      await input.get('[data-test="clear"]').trigger('click')
      expect(input.props().modelValue).toBe("")
    })
  })
})
