export * from "./useInputAttrs"
export * from "./useInputText"
export * from "./useInputNumber"
export * from "./useInputValidation"
export * from "./useDataProvider"
export * from "./useInputOptionsProvider"

export type EventHandler = (event: Event) => void
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler