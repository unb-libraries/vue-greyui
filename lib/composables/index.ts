export * from "./useInputText"
export * from "./useInputValidation"
export * from "./useInputAttrs"

export type EventHandler = (event: Event) => void
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler