import { mount } from "@vue/test-utils"
import { describe, expect, test } from "vitest"
import { defineComponent } from "vue"
import { useInputAttrs } from "../useInputAttrs"

const Input = defineComponent({
  inheritAttrs: false,
  setup() {
    return useInputAttrs()
  },
  template: `
    <input type="text" data-test="input" :id="id" :name="name" />
  `
})

describe('useInputAttrs', () => {
  test('ID,name provided', () => {
    const wrapper = mount(Input, { attrs: { id: 'colour', name: 'colour' }})
    const el = wrapper.get('[data-test="input"]')
    expect(el.attributes('id')).toEqual('input-colour')
    expect(el.attributes('name')).toEqual('colour')
  })

  test('ID provided', () => {
    const wrapper = mount(Input, { attrs: { id: 'colour' }})
    const el = wrapper.get('[data-test="input"]')
    expect(el.attributes('id')).toEqual('input-colour')
    expect(el.attributes('name')).toEqual('colour')
  })

  test('Name provided', () => {
    const wrapper = mount(Input, { attrs: { name: 'colour' }})
    const el = wrapper.get('[data-test="input"]')
    expect(el.attributes('id')).toEqual('input-colour')
    expect(el.attributes('name')).toEqual('colour')
  })

  test('ID,name not provided', () => {
    const wrapper = mount(Input)
    const el = wrapper.get('[data-test="input"]')
    const id = el.attributes('id')
    expect(id).toMatch(/^input-[a-zA-Z0-9-]+$/)
    expect(el.attributes('name')).toEqual(id.substring(6))
  })
})