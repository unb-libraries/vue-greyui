import { mount } from "@vue/test-utils"
import { describe, expect, test } from "vitest"
import { defineComponent } from "vue"
import { useInputTable } from "../useInputTable"
import type { InputTableOptions} from "../useInputTable"
import type { Cardinality } from ".."

const TableInput = <C extends Cardinality>(options?: Partial<InputTableOptions<C>>) => defineComponent({
  props: {
    modelValue: {
      type: Object,
      required: false,
      default: undefined,
    },
    columns: {
      type: Array<string>,
      required: true,
    },
    rows: {
      type: Array<object>,
      required: true,
    },
    id: {
      type: [String, Function],
      required: false,
      default: undefined,
    },
    label: {
      type: Object,
      required: false,
      default: undefined,
    }
  },
  emits: ['update:modelValue', 'select'],
  setup(props, { emit }) {
    // @ts-expect-error - Ignore type error
    return useInputTable<Record<string, string>>(props, emit, options)
  },
  template: `
    <table>
      <thead>
        <tr>
          <th v-for="{id: cid, label} in columns" :key="cid" :data-test="'th-' + cid">{{ label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="[rid, row] in rows.provider.options.value" :key="rid" @click="rows.select(rid)" :data-test="'tr-' + rid">
          <td v-for="[column, cell] of Object.entries(row)" :key="rid + ':' + column" :data-test="'td-' + rid + ':' + column">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  `
})

describe("useInputTable", () => {
  const columns = ["cid", "uid", "name"]
  const rows = [
    { cid: "grey", uid: "gr770", name: "Grey", colour: { hex: "777777" } },
    { cid: "dark-grey", uid: "gr880", name: "Dark Grey", colour: { hex: "0a0a0a" } },
    { cid: "light-grey", uid: "rt56jk", name: "Light grey", colour: { hex: "c0c0c0" } },
  ]

  test("table head", async () => {
    const wrapper = mount(TableInput(), { props: { columns, rows } })
    
    expect(wrapper.get('[data-test="th-cid"]').element.textContent).toBe("Cid")
    expect(wrapper.get('[data-test="th-uid"]').element.textContent).toBe("Uid")
    expect(wrapper.get('[data-test="th-name"]').element.textContent).toBe("Name")
  })
  
  test("table data", async () => {
    const wrapper = mount(TableInput(), { props: {
      columns,
      rows,
      id: "uid",
      label: {
        uid: (name: string) => name.toUpperCase(),
        colour: "hex",
      }
    }})
    
    expect(wrapper.get('[data-test="td-gr770:cid"]').element.textContent).toBe("grey")
    expect(wrapper.get('[data-test="td-rt56jk:uid"]').element.textContent).toBe("RT56JK")
    expect(wrapper.get('[data-test="td-gr880:name"]').element.textContent).toBe("Dark Grey")
  })

  test("select row", async () => {
    const wrapper = mount(TableInput(), { props: { columns, rows, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
    
    await wrapper.get('[data-test="tr-grey"]').trigger('click')
    expect(wrapper.props("modelValue")).toBe("grey")
    await wrapper.get('[data-test="tr-dark-grey"]').trigger('click')
    expect(wrapper.props("modelValue")).toBe("dark-grey")
  })

  test("select multiple rows", async () => {
    const wrapper = mount(TableInput({ cardinality: "many" }), { props: { columns, rows, "onUpdate:modelValue": (value) => wrapper.setProps({ modelValue: value }) }})
    
    await wrapper.get('[data-test="tr-grey"]').trigger('click')
    await wrapper.get('[data-test="tr-dark-grey"]').trigger('click')
    
    expect(wrapper.props("modelValue")).toEqual(["grey", "dark-grey"])
    expect(wrapper.emitted()).toHaveProperty("select")
    expect(wrapper.emitted("select")).toEqual([[[], [["grey", "grey"], ["dark-grey", "Dark grey"]], [["grey", "grey"]]]])
  })
})