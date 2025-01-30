export * from "./useInputAttrs"
export * from "./useInputBoolean"
export * from "./useInputText"
export * from "./useInputNumber"
export * from "./useInputValidation"
export * from "./useDataProvider"
export * from "./useInputOptionsProvider"
export * from "./useInputTable"

export type EventHandler = (event: Event) => void
export type Cardinality = "single" | "many"
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler