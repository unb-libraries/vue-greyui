import { useAttrs, useId } from 'vue'

export interface InputAttrsOptions {
  idPrefix: string
}

export interface InputAttrs {
  id: string
  name: string
}

export function useInputAttrs(options?: Partial<InputAttrsOptions>): InputAttrs {
  const { idPrefix } = { idPrefix: 'input-', ...options }
  
  const attrs = useAttrs() as Partial<Record<"id" | "name", string>>
  let { id, name } = attrs
  id ||= name ?? useId()
  id = idPrefix + id
  name ||= id.substring(idPrefix.length)

  return { ...attrs, id, name }
}