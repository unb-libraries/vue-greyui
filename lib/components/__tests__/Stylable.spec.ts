import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'
import { defineComponent, markRaw } from 'vue'
import { Stylable } from '../../components'
import type { Component} from 'vue'

const Light = defineComponent({
  props: {
    author: {
      type: String,
      required: false,
      default: 'Mr. Grey'
    },
    created: {
      type: String,
      required: false,
      default: '2000-01-01'
    }
  },
  template: `
    <div>
      <span data-test="theme">Light grey</span>
      <ul><li v-for="[prop,value] in Object.entries($props)" :data-test="prop">{{ value }}</li></ul>
    </div>
  `
})

const Dark = defineComponent({
  template: `<div data-test="theme">Dark grey</div>`
})

const Custom = defineComponent({
  template: `<span data-test="theme">Custom grey</span>`
})

describe('Stylable', () => {
  vi.mock('~/utils/layout', async (importOriginal) => {
    return {
      ...await importOriginal(),
      resolveLayout(_: Component, name: string) {
        switch (name) {
          case 'dark':
            return Dark
          case 'default':
          case 'light':
            return Light
          default:
            return null
        }
      }
    }
  })

  describe('Loading layout', () => {
    test('default', () => {
      const wrapper = mount(Stylable, { props: { layout: 'default' } })
      expect(wrapper.get('[data-test="theme"]').text()).toBe('Light grey')
    })
    
    test('light', () => {
      const wrapper = mount(Stylable, { props: { layout: 'light' } })
      expect(wrapper.get('[data-test="theme"]').text()).toBe('Light grey')
    })
    
    test('dark', () => {
      const wrapper = mount(Stylable, { props: { layout: 'dark' } })
      expect(wrapper.get('[data-test="theme"]').text()).toBe('Dark grey')
    })
    
    test('custom', () => {
      const wrapper = mount(Stylable, { props: { layout: markRaw(Custom) } })
      expect(wrapper.get('[data-test="theme"]').text()).toBe('Custom grey')
    })
    
    test('with props', () => {
      const wrapper = mount(Stylable, { props: { layout: 'default', author: 'Mrs. Grey', created: '2025-01-01' } })
      expect(wrapper.get('[data-test="theme"]').text()).toBe('Light grey')
      expect(wrapper.get('[data-test="author"]').text()).toBe('Mrs. Grey')
      expect(wrapper.get('[data-test="created"]').text()).toBe('2025-01-01')
    })
  })
})
