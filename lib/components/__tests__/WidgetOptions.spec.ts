import { WidgetOptions } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { computed, defineComponent, markRaw, ref } from 'vue'
import { useDataProvider } from '~/composables'

const Layout = defineComponent({
  props: ['value', 'cardinality', 'options', 'labelKey', 'optionKey', 'required', 'min', 'max', 'valid', 'error'],
  emits: ['toggle', 'select', 'unselect', 'add', 'filter', 'clear', 'validate'],
  setup(props, { emit }) {
    return {
      onToggle(index: number[]) {
        emit('toggle', ...index.map(i => Object.values(props.options)[i]))
      },
      onSelect(index: number[]) {
        emit('select', ...index.map(i => Object.values(props.options)[i]))
      },
      onUnselect(index: number[]) {
        emit('unselect', ...index.map(i => Object.values(props.options)[i]))
      },
      onAdd(value: string) {
        emit('add', value)
      },
      onFilter(filter: string) {
        const pattern = new RegExp(`^${filter}`)
        emit('filter', (value: string) => pattern.test(value))
      },
      onClear() {
        emit('clear')
      },
      onValidate() {
        emit('validate')
      },
    }
  },
  template: `
    <div>
      <span data-test="value">{{ Array.isArray(value) ? value.join(',') : value }}</span>
      <input data-test="toggle" @input.stop="onToggle($event.target.value.split(',').map(Number))" />
      <input data-test="select" @input.stop="onSelect($event.target.value.split(',').map(Number))" />
      <input data-test="unselect" @input.stop="onUnselect($event.target.value.split(',').map(Number))" />
      <input data-test="other" @input.stop="onAdd($event.target.value)" />
      <input data-test="filter" @input.stop="onFilter($event.target.value)" />
      <button data-test="clear" @click="onClear" />
      <button data-test="validate" @click="onValidate" />
      <div data-test="error">{{ error }}</div>
    </div>
  `
})

describe('WidgetSelect', async () => {
  vi.mock('~/composables/useDataProvider', () => ({
    useDataProvider(data: string[]) {
      let values = ref(data)
      const mapper = (v: string) => ({ id: v })
      return {
        data: { value: Object.fromEntries(values.value.map(mapper).map(v => [v.id, v])) },
        size: { value: values.value.length },
        keys: { value: values.value.map(mapper).map(v => v.id) },
        values: { value: values.value.map(mapper) },
        add: vi.fn(() => {}),
        filter: vi.fn(() => {}),
      }
    }
  }))

  function mountWidget(props?: Parameters<typeof mount>["1"]["props"]) {
    const widget = mount(WidgetOptions, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        options: useDataProvider(['Grey', 'Light grey', 'Dark grey']),
        'onUpdate:modelValue': (newValue: string) => widget.setProps({ modelValue: newValue }),
        ...props ?? {},
      }
    })
    return widget
  }

  describe('Single select', () => {
    test('toggle', async () => {
      const wrapper = mountWidget()

      expect(wrapper.find('[data-test="value"]').text()).toBe('')
    
      await wrapper.get('[data-test="toggle"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.find('[data-test="value"]').text()).toBe('Grey')
      
      await wrapper.get('[data-test="toggle"]').setValue('0')
      expect(wrapper.props().modelValue).toBe(undefined)
      expect(wrapper.find('[data-test="value"]').text()).toBe('')
    })
    
    test('select', async () => {
      const wrapper = mountWidget()
      expect(wrapper.get('[data-test="value"]').text()).toBe('')
      
      await wrapper.get('[data-test="select"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.find('[data-test="value"]').text()).toBe('Grey')
      
      await wrapper.get('[data-test="select"]').setValue('0')
      expect(wrapper.props().modelValue).toBe('Grey')
      expect(wrapper.find('[data-test="value"]').text()).toBe('Grey')
    })
    
    test('unselect', async () => {
      const wrapper = mountWidget({ modelValue: 'Grey' })
      await wrapper.get('[data-test="unselect"]').setValue('0')
      expect(wrapper.props().modelValue).toBe(undefined)
    })

    describe('clear', () => {
      test('initialized', async () => {
        const wrapper = mountWidget({ modelValue: 'Grey' })
        await wrapper.get('[data-test="clear"]').trigger('click')
        expect(wrapper.props().modelValue).toBe(null)
        expect(wrapper.get('[data-test="value"]').text()).toBe('')
      })
      
      test('uninitialized', async () => {
        const wrapper = mountWidget()
        await wrapper.setProps({ modelValue: 'Grey' })
        await wrapper.get('[data-test="clear"]').trigger('click')
        expect(wrapper.props().modelValue).toBe(undefined)
        expect(wrapper.get('[data-test="value"]').text()).toBe('')
      })
    })

    test('validate', async () => {
      const wrapper = mountWidget({ required: true })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')
      
      await wrapper.setProps({ modelValue: 'Grey' })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).toBe('')
    })
  })
  
  describe('Multi select', () => {
    test('toggle', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' })
      await wrapper.get('[data-test="toggle"]').setValue('1,2')
      expect(wrapper.props().modelValue).toEqual(['Grey', 'Dark grey'])
    })

    test('select', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' })
      await wrapper.get('[data-test="select"]').setValue('1,2')
      expect(wrapper.props().modelValue).toEqual(['Grey', 'Light grey', 'Dark grey'])
    })
    
    test('unselect', async () => {
      const wrapper = mountWidget({ modelValue: ['Grey', 'Light grey'], cardinality: 'many' })
      await wrapper.get('[data-test="unselect"]').setValue('0,1')
      expect(wrapper.props().modelValue).toEqual([])
    })

    describe('clear', () => {
      test('initialized', async () => {
        const wrapper = mountWidget({ modelValue: ['Grey'], cardinality: 'many' })
        await wrapper.get('[data-test="clear"]').trigger('click')
        expect(wrapper.props().modelValue).toBe(null)
        expect(wrapper.get('[data-test="value"]').text()).toBe('')
      })

      test('uninitialized', async () => {
        const wrapper = mountWidget({ cardinality: 'many' })
        await wrapper.setProps({ modelValue: ['Grey'] })
        await wrapper.get('[data-test="clear"]').trigger('click')
        expect(wrapper.props().modelValue).toEqual([])
        expect(wrapper.get('[data-test="value"]').text()).toBe('')
      })
    })

    test('validate', async () => {
      const wrapper = mountWidget({ cardinality: 'many', min: 1, max: 1 })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).not.toBe('')
      
      await wrapper.setProps({ modelValue: ['Grey'] })
      await wrapper.get('[data-test="validate"]').trigger('click')
      expect(wrapper.get('[data-test="error"]').text()).toBe('')
    })
  })

  describe('Options', () => {
    test('add', async () => {
      const wrapper = mountWidget()
      await wrapper.get('[data-test="other"]').setValue('Mid grey')
      expect(wrapper.props().options.add).toHaveBeenCalledWith('Mid grey')
    })
    
    test('filter', async () => {
      const wrapper = mountWidget()
      await wrapper.get('[data-test="filter"]').setValue('Light')
      expect(wrapper.props().options.filter).toHaveBeenCalledWith(expect.any(Function))
    })
  })

})