export * from "./useInputText"
export * from "./useInputValidation"

export type EventHandler = (event: Event) => void
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler