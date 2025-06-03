export * from "~/composables/useDataProvider"
export * from "~/composables/useInputAttrs"

export type EventHandler = (event: Event) => void
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler