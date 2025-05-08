import { ref, watch, type Ref } from "vue"
import type { Input, InputEmits, InputOptions, InputProps } from "./useInput"

export type Validator<T = unknown> = (value: T) => true | string

export interface ValidatedProps<T = unknown> {
  validators?: Validator<T>[]
}

export type ValidatedInputProps<T> = T extends InputProps<infer P>
  ? ValidatedProps<P> & T
  : ValidatedInputProps<InputProps<T>>

export type ValidatedInputEmits<T extends InputEmits> = {
  validated: [valid: boolean, error?: string]
} & T

export interface ValidateOptions {
  autoValidate: boolean
}

export type ValidatedInputOptions<T extends InputOptions> = ValidateOptions & T

export type ValidatedInput<T> = T extends Input<infer I> ? {
  validate: Validator<I>
  valid: Ref<boolean>
  error?: Ref<string>
} & T : ValidatedInput<Input<unknown>>

export function useInputValidation<T = unknown>(input: Input<T>, validators: Validator<T>[], options?: Partial<ValidateOptions>): ValidatedInput<Input<T>> {
  const { autoValidate } = { autoValidate: true, ...options }
  const { value, ...validatedInput } = input

  const valid = ref<boolean>()
  const error = ref<string>()
  
  function validate(value: T) {
    let index = 0, res: true | string = true
    while (index < validators.length && res === true) {
      res = validators[index++](value)
    }
    
    valid.value = typeof res !== 'string'
    error.value = typeof res === 'string'
      ? res
      : undefined

    return res
  }

  if (autoValidate) {
    watch(value, validate)
  }

  return {
    ...validatedInput,
    value,
    validate,
    valid,
    error,
  }
}

export function useValidate<T>(value: Ref<T>, validators: Validator<T>[], options?: Partial<ValidateOptions>) {
  const { autoValidate } = { autoValidate: true, ...options }
  const valid = ref<boolean>()
  const error = ref<string>()

  function validate(value: T) {
    let index = 0, res: true | string = true
    while (index < validators.length && res === true) {
      res = validators[index++](value)
    }

    valid.value = typeof res !== 'string'
    error.value = typeof res === 'string'
      ? res
      : undefined

    return res
  }

  if (autoValidate) {
    watch(value, validate)
  }

  return {
    validate,
    valid,
    error,
  }

}
