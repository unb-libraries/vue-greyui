import { unref } from 'vue'
import type { Ref } from 'vue'

interface FocusOptions {
  selector: string
  parent: string | HTMLElement
  index: number
}

export function focusNextSibling(el: HTMLElement | Ref<HTMLElement>, options?: Partial<Omit<FocusOptions, 'index'>>) {
  const { selector = '*', parent: parentSelector } = options ?? {}
  const element = unref(el)
  const parent: HTMLElement = parentSelector ? typeof parentSelector === 'string' ? element.closest(parentSelector) : parentSelector : element.parentElement
  const siblings = parent?.querySelectorAll(`>${selector}`)
  const index = Array.from(siblings).indexOf(element)
  const nextSibling = Array.from(siblings).slice(index + 1).at(0) as HTMLElement
  nextSibling?.focus()
}

export function focusPreviousSibling(el: HTMLElement | Ref<HTMLElement>, options?: Partial<Omit<FocusOptions, 'index'>>) {
  const { selector = '*', parent: parentSelector } = options ?? {}
  const element = unref(el)
  const parent: HTMLElement = parentSelector ? typeof parentSelector === 'string' ? element.closest(parentSelector) : parentSelector : element.parentElement
  const siblings = parent?.querySelectorAll(`>${selector}`)
  const index = Array.from(siblings).indexOf(element)
  const prevSibling = Array.from(siblings).slice(0, index).at(-1) as HTMLElement
  prevSibling?.focus()
}

export function focusChild(el: HTMLElement | Ref<HTMLElement>, options?: Partial<{ selector: string, index: number }>) {
  const { selector = '*', index = 0 } = options ?? {}
  const element = unref(el)
  const trueIndex = index >= 0 ? index : element.children.length - Math.min(element.children.length, Math.abs(index));
  const children = element.querySelectorAll(selector)
  const child = Array.from(children).at(trueIndex) as HTMLElement
  child?.focus()
}
