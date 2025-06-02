export * from "./useDataProvider"
export * from "./useInputAttrs"

export type EventHandler = (event: Event) => void
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler