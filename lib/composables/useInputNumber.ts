import useInput from "./useInput"
import { computed, ref, watch, type Ref } from "vue"
import type { Emit, Input, InputEmits, InputOptions, InputProps } from "./useInput"

export interface InputNumberProps extends InputProps<number> {
  decimals: number
  steps: number[]
}

export type InputNumberEmits = InputEmits<number>

export interface InputNumberOptions extends InputOptions<0> {
  round: boolean
}

export interface InputNumber extends Input<number> {
  displayValue: Ref<string | number>
  stepUp: (size?: number) => void
  stepDown: (size?: number) => void
}

export function useInputNumber(props: InputNumberProps, emits: Emit<InputNumberEmits>, options?: Partial<InputNumberOptions>): InputNumber {
  const { round, ...inputOptions } = {
    round: true,
    ...options,
  }

  const { value, ...input } = useInput<number>(props, emits, inputOptions)
  const decimals = computed(() => Math.min(20, Math.max(0, props.decimals ?? 0)))
  const displayValue = ref<string>(`${value.value}`)

  watch(decimals, (decimals) => {
    displayValue.value = Number(displayValue).toFixed(decimals)
  })

  watch(displayValue, (newDisplayValue, prevDisplayValue) => {
    const num = Number(newDisplayValue)
    if (!isNaN(num)) {
      displayValue.value = num.toFixed(decimals.value)
      value.value = Number(displayValue.value)
      
    } else {
      displayValue.value = prevDisplayValue
    }
  })

  function inc(options?: Partial<{ up: boolean, stepIndex: number }>) {
    const stepSizeAt =  (index: number, reverse?: boolean) => {
      const normalizedIndex = Math.min(props.steps.length - 1, Math.max(0, index))
      const stepSize = Number(props.steps[normalizedIndex].toFixed(decimals.value))
      return reverse ? stepSize * -1 : stepSize
    }
  
    const pow = (value: number) => value * Math.pow(10, decimals.value)
    const unpow = (value: number) => value / Math.pow(10, decimals.value)
    
    const step = stepSizeAt(options?.stepIndex ?? 0, !options?.up)
    const current = value.value ?? 0
    const rest = step - unpow(pow(current) % pow(step))
    displayValue.value = `${current + (round && rest ? rest : step)}`
  }

  return {
    ...input,
    value,
    displayValue,
    stepUp: (step?: number) => inc({ up: true, stepIndex: step }),
    stepDown: (step?: number) => inc({ up: false, stepIndex: step })
  }
}
