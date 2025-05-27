import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import { defineComponent, markRaw } from 'vue'
import { before } from 'node:test'
import { Modal } from '~/components'

const Layout = defineComponent({
  emits: ['close'],
  template: `
  <div class="modal-layout">
    <div data-test="modal" />
    <button @click="$emit('close')">Close</button>
  </div>
  `
})

describe('Modal', () => {
  function mountModal(props?: Parameters<typeof mount>["1"]["props"]) {
    const modal = mount(Modal, {
      props: {
        // @ts-ignore
        layout: markRaw(Layout),
        container: '#modals',
        'onUpdate:modelValue': (newValue: boolean) => modal.setProps({ open: newValue }),
        ...props ?? {},
      }
    })
    return modal
  }

  before(() => {
    const div = document.createElement('div')
    div.id = 'modals'
    document.body.appendChild(div)
  })

  test('Open', async () => {
    const modal = mountModal()
    
    let layout = modal.findComponent(Layout)
    expect(layout.exists()).to.be.false
    
    await modal.setProps({ open: true })
    layout = modal.findComponent(Layout)
    expect(layout.exists()).to.be.true
    expect(layout.get('[data-test="modal"]')).to.exist
  })

  test('Close', async () => {
    const modal = mountModal({ open: true })
    
    let layout = modal.findComponent(Layout)
    expect(layout.exists()).to.be.true

    await layout.get('button').trigger('click')
    expect(modal.emitted()).to.have.property('close')
    layout = modal.findComponent(Layout)
    expect(layout.exists()).to.be.false
    expect(modal.find('[data-test="modal"]').exists()).to.be.false
  })
})