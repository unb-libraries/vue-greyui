import { mount } from '@vue/test-utils'
import { describe, expect, it, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'
import { Widget } from '../../components'

const Layout = defineComponent({
  props: ['value', 'cardinality', 'required', 'min', 'max', 'valid', 'error'],
  emits: ['input', 'clear', 'validate'],
  template: `
    <div>
      <template v-if="cardinality === 'many'">
        <span v-for="(v, i) in value" :key="v" :data-test="value + '.' + i">{{ v }}</span>
        <span data-test="min">{{ min }}</span>
        <span data-test="max">{{ max }}</span>
      </template>
      <template v-else>
        <span data-test="value">{{ value }}</span>
        <span data-test="required">{{ JSON.stringify(required) }}</span>
      </template>
      <input data-test="input" @input.stop="$emit('input', cardinality === 'many' ? [$event.target.value] : $event.target.value)" />
      <button data-test="clear" @click="$emit('clear')" />
      <button data-test="validate" @click="$emit('validate')" />
      <span data-test="error">{{ error }}</span>
    </div>
  `
})

describe('Widget', () => {
  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(Widget, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        emptyValue: '',
        'onUpdate:modelValue': (newValue: string) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      }
    })
    return widget
  }

  describe('Single-value', () => {
    test('set', async () => {
      const widget = mountWidget()
      await widget.get('[data-test="input"]').setValue('Grey')
      expect(widget.get('[data-test="value"]').text()).toBe('Grey')
    })

    describe('clear', () => {
      it('initialized', async () => {
        const widget = mountWidget({ modelValue:'Grey' })
        await widget.get('[data-test="clear"]').trigger('click')
        expect(widget.props().modelValue).toBe(null)
        expect(widget.get('[data-test="value"]').text()).toBe('')
      })
      
      it('uninitialized', async () => {
        const widget = mountWidget()
        await widget.get('[data-test="clear"]').trigger('click')
        expect(widget.props().modelValue).toBe('')
        expect(widget.get('[data-test="value"]').text()).toBe('')
      })
    })

    test('Validate', async () => {
      const wrapper = mountWidget({ required: true })
      
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')
      
      await wrapper.get('[data-test="input"]').setValue('Grey')
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).toBe('')
    })
  })

  describe('Multi-value', () => {
    test('set', async () => {
      const widget = mountWidget({ cardinality: 'many' })
      await widget.get('[data-test="input"]').setValue('Grey')
      expect(widget.props().modelValue).toEqual(['Grey'])
    })
    
    describe('clear', () => {
      it('initialized', async () => {
        const widget = mountWidget({ cardinality: 'many', modelValue: ['Grey'] })
        await widget.get('[data-test="clear"]').trigger('click')
        expect(widget.props().modelValue).toBe(null)
      })
      
      it('uninitialized', async () => {
        const widget = mountWidget({ cardinality: 'many' })
        await widget.get('[data-test="clear"]').trigger('click')
        expect(widget.props().modelValue).toBe('')
      })
    })

    test('validate', async () => {
      const wrapper = mountWidget({ cardinality: 'many', min: 1, max: 3 })
      expect(wrapper.get('[data-test="min"]').text()).toBe('1')
      expect(wrapper.get('[data-test="max"]').text()).toBe('3')

      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')

      await wrapper.setProps({ modelValue: ['Grey', 'Light grey', 'Dark grey', 'Ultra dark grey'] })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')
      
      await wrapper.setProps({ modelValue: ['Grey'] })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).toBe('')
    })
  })
  
  describe('Validation', async () => {
    it('auto', async () => {
      const widget = mountWidget({ autoValidate: true, validators: [(value: string) => value === 'Grey' || "Must be 'Grey'"] })
      
      await widget.get('[data-test="input"]').setValue('Grey')
      await widget.get('[data-test="input"]').setValue('White')
      
      expect(widget.emitted()).toHaveProperty('validated')
      expect(widget.emitted('validated')).toHaveLength(2)
      expect(widget.emitted('validated')[0]).toEqual([true, undefined])
      expect(widget.emitted('validated')[1]).toEqual([false, "Must be 'Grey'"])
    })
    
    it('on-demand', async () => {
      const widget = mountWidget({ validators: [() => true] })
      
      await widget.get('[data-test="input"]').setValue('Grey')
      expect(widget.emitted()).not.toHaveProperty('validated')
      
      await widget.get('[data-test="input"]').setValue('White')
      await widget.get('[data-test="validate"]').trigger('click')
      expect(widget.emitted()).toHaveProperty('validated')
      expect(widget.emitted('validated')).toHaveLength(1)
    })
  })
})
