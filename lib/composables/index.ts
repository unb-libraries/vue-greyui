export * from "./useDataProvider"
export * from "./useInputAttrs"
export * from "./useInputBoolean"
export * from "./useInputNumber"
export * from "./useInputSelect"
export * from "./useInputText"
export * from "./useInputValidation"

export type EventHandler = (event: Event) => void
export type Cardinality = "single" | "many"
export type TCardinality<T = unknown, C extends Cardinality = "single"> = C extends "single" ? T : T[]
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler