export * from "./useDataProvider"
export * from "./useInputAttrs"

export type EventHandler = (event: Event) => void
export type Cardinality = "single" | "many"
export type TCardinality<T = unknown, C extends Cardinality = "single"> = C extends "single" ? T : T[]
export type InputHandler<T = unknown> = (handler: (value: T) => void) => EventHandler