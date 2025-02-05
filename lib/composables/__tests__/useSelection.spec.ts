import { mount } from "@vue/test-utils"
import { describe, expect, test, vi } from "vitest"
import { defineComponent } from "vue"
import { useDataProvider } from "../useDataProvider"
import { useSelection } from "../useSelection"
import type { Cardinality } from ".."

vi.mock("../useDataProvider", () => {
  return {
    useDataProvider: (data: string[]) => ({
      data: { value: data },
      add: (item: string) => data.push(item),
      has: (item: string) => data.includes(item),
      filter: () => {},
      remove: (index: number) => data.splice(index, 1),
      set: (newData: string[]) => data = newData,
      sort: () => {}
    }),
  }
})

const Input = (options?: { cardinality: Cardinality }) => defineComponent({
  props: {
    modelValue: {
      type: [String, Array<string>],
      required: false,
      default: options?.cardinality === "many" ? [] : undefined,
    },
    provider: {
      type: Object,
      required: false,
      default: useDataProvider<string>(["grey", "dark-grey", "light-grey"]),
    },
  },
  emits: ['update:modelValue', 'select', 'deselect'],
  setup(props, { emit }) {
    // @ts-expect-error - Ignore type error
    return useSelection<string>(props, emit, { cardinality: options?.cardinality })
  },
  template: `
    <div>
      <div v-for="option in provider.data.value" :key="option">
        <input type="checkbox" :value="option" :checked="isSelected(option)" :data-test="option" @change="toggle(option)" />
        <label>{{ option }}</label>
      </div>
    </div>
  `
})

describe("useSelection", () => {
  describe("Select", () => {
    test("Single-Value", async () => {
      const wrapper = mount(Input(), { props: { "onUpdate:modelValue": value => wrapper.setProps({ modelValue: value }) }, attachTo: document.body })
      
      await wrapper.get('[data-test="grey"]').trigger("change")
      expect(wrapper.props("modelValue")).toEqual("grey")
      await wrapper.get('[data-test="dark-grey"]').trigger("change")
      expect(wrapper.props("modelValue")).toEqual("dark-grey")
      await wrapper.get('[data-test="dark-grey"]').trigger("change")
      expect(wrapper.props("modelValue")).toEqual(undefined)

      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([
        ["grey", "grey"],
        ["dark-grey", "dark-grey"],
      ])
      
      expect(wrapper.emitted()).toHaveProperty("deselect")
      expect(wrapper.emitted("deselect")).toEqual([
        ["dark-grey", undefined],
      ])
    })

    test("Multi-Value", async () => {
      const wrapper = mount(Input({ cardinality: "many" }), { props: { "onUpdate:modelValue": value => wrapper.setProps({ modelValue: value }) }, attachTo: document.body })
      
      await wrapper.get('[data-test="grey"]').trigger("change")
      expect(wrapper.props("modelValue")).toEqual(["grey"])
      await wrapper.get('[data-test="dark-grey"]').trigger("change")
      expect(wrapper.props("modelValue")).toEqual(["grey", "dark-grey"])
      await wrapper.get('[data-test="dark-grey"]').trigger("change")
      expect(wrapper.props("modelValue")).toEqual(["grey"])

      expect(wrapper.emitted()).toHaveProperty("select")
      expect(wrapper.emitted("select")).toEqual([
        ["grey", ["grey"]],
        ["dark-grey", ["grey", "dark-grey"]],
      ])
      
      expect(wrapper.emitted()).toHaveProperty("deselect")
      expect(wrapper.emitted("deselect")).toEqual([
        ["dark-grey", ["grey"]],
      ])
    })
  })
})