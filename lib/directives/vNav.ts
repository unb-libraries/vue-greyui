import { unref } from 'vue'
import type { ObjectDirective, Ref } from 'vue'
import { focusChild, focusNextSibling, focusPreviousSibling } from '~/utils'

/**
 * Enables arrow key navigation for the element to which the directive attaches.
 * 
 * @param el - The element to which to apply the directive.
 * @param binding - The directive binding object.
 *  value: (string | number) Sets the navigation group.
 *  modifiers:
 *    swap: swap horizontal (left/right) and vertical (up/down) navigation.
 *    tree: enable navigating to children.
 * 
 * @example <li v-nav="'items'">Item</li>
 */
const vNav: ObjectDirective<HTMLElement, string | number, 'swap' | 'tree'> = {
  mounted(el, { value, modifiers: { swap, tree }}) {
    el.setAttribute('data-nav-group', String(value))
    if (el.getAttribute('tabindex') === null) {
      el.setAttribute('tabindex', '-1')
    }

    
    el.addEventListener('keyup', (evt: KeyboardEvent) => {
      if (!swap ? evt.key === 'ArrowLeft' : 'ArrowUp') {
        evt.stopPropagation()
        focusPreviousSibling(el, { selector: `[data-nav-group="${value}"]` })
      } else if (!swap ? evt.key === 'ArrowRight' : 'ArrowDown') {
        evt.stopPropagation()
        focusNextSibling(el, { selector: `[data-nav-group="${value}"]` })
      } else if (evt.key === 'Escape') {
        (el.closest(`[data-nav-group="${value}"]`) as HTMLElement)?.focus()
      }
    })

    if (tree) {
      el.addEventListener('keyup', (evt: KeyboardEvent) => {
        if (['Enter', ' '].includes(evt.key)) {
          evt.stopPropagation()
          focusChild(el, { selector: `[data-nav-group="${value}"]` })
        }
      })
    }
  },
}

export default vNav
