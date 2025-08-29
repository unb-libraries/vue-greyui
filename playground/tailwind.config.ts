import forms from '@tailwindcss/forms'
import scrollbar from 'tailwind-scrollbar'
import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

type HSL = { h: number; s: number; l: number }
type RGB = `#${string}`
type Colour = RGB | HSL
type ShadingOptions = { count: number; step: number; padding: number }

function hexToHSL(hex: string): HSL {
  const r = parseInt(hex.slice(1, 3), 16) /  255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  let l = (max + min) / 2

  if (delta !== 0) {
    s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min)
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60
        break
      case g:
        h = ((b - r) / delta + 2) * 60
        break
      case b:
        h = ((r - g) / delta + 4) * 60
        break
    }
  }

  return { h, s: s * 100, l: l * 100 }
}

function hslToHex(hsl: HSL): string {
  const { h, s, l } = hsl
  const a = s * Math.min(l, 100 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)) / 100
    return Math.round(color * 255).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function generateColorShades(hsl: HSL, options?: Partial<ShadingOptions>): HSL[] {
  const count = options?.count ?? 100 / (options?.step ?? 10)
  const step = options?.step ?? 100 / count
  const padding = options?.padding ?? 0
  
  const shades = Array
    .from({ length: count * 2 }, (_, i) => ({
      h: Math.max(Math.min(hsl.h, 360), 0),
      s: Math.max(Math.min(hsl.s, 100), 0),
      l: hsl.l + (i - count) * step,
    }))
    .filter(({ l }) => Math.ceil(l) >= padding && Math.floor(l) <= 100 - padding)

  const start = Math.max(0, shades.findIndex(({ l }) => l === hsl.l) - Math.floor(count / 2))
  const end = start + count

  return shades.slice(
    end <= shades.length? start : Math.max(0, end - count),
    Math.min(end, shades.length),
  )
}

function generateColorVariantMap<T extends string>(name: T, colour: Colour, options?: Partial<ShadingOptions>): Record<T, string> {
  const hsl = typeof colour === 'string' ? hexToHSL(colour) : colour
  return {
    [name]: hslToHex(hsl),
    ...Object.fromEntries(
    generateColorShades(hsl, options)
      .map(({ h, s, l }) => [
        `${name}-${Math.round(l)}`,
        hslToHex({ h, s, l }),
      ]))
  } as Record<T, string>
}

const colors = {
  ...generateColorVariantMap('base', `#495966`, { padding: 6 }),
  ...generateColorVariantMap('primary', `#ea0029`, { step: 10, count: 5 }),
  ...generateColorVariantMap('accent', `#40a9c1`, { step: 10, count: 5 }),
  'red': '#ea0029',
  'yellow': '#fadb14',
  'black': `#000000`,
  'white': `#ffffff`,
  'transparent': `transparent`,
}

// colors['widget-text'] = getNthColorShade('base-94', -2)

function getNthColorShade(color: string, n: number): string {
  const index = Object.entries(colors).findIndex(([key]) => key === color)
  return Object.entries(colors)
    .filter(([key]) => key.startsWith(color.split('-')[0]))
    .map(([, value]) => value)
    .at(index + n)
}

export default {
  content: [
    "src/**/*.vue",
  ],
  theme: {
    colors,
    fontSize: {
      50: `0.5rem`,
      '50r': `0.5em`,
      75: `0.75rem`,
      '75r': `0.75em`,
      85: `0.85rem`,
      '85r': `0.85em`,
      100: `16px`,
      '100r': `1em`,
      125: `1.25rem`,
      '125r': `1.25em`,
      150: `1.5rem`,
      '150r': `1.5em`,
      200: `2rem`,
      '200r': `2em`,
      400: `4rem`,
      '400r': `4em`,
      800: `8rem`,
      '800r': `8em`,
    },
    spacing: {
      0: `0`,
      10: `0.1rem`,
      '10r': `0.1em`,
      15: `0.15rem`,
      '15r': `0.15em`,
      25: `0.25rem`,
      '25r': `0.25em`,
      50: `0.5rem`,
      '50r': `0.5em`,
      75: `0.75rem`,
      '75r': `0.75em`,
      100: `1rem`,
      '100r': `1em`,
      125: `1.25rem`,
      '125r': `1.25em`,
      150: `1.5rem`,
      '150r': `1.5em`,
      200: `2rem`,
      '200r': `2em`,
      400: `4rem`,
      '400r': `4em`,
      800: `8rem`,
      '800r': `8em`,
      1200: `12rem`,
      '1200r': `12em`,
      1600: `16rem`,
      '1600r': `16em`,
      px: `1px`,
      '1/5': `20%`,
    },
    borderRadius: {
      0: `0`,
      25: `0.25em`,
      50: `0.5em`,
      75: `0.75em`,
      100: `1em`,
      full: `9999px`,
    },
  },
  extend: {
    transitionProperty: {
      size: `width,max-width,min-width,height,max-height,min-height,margin,padding`,
    },
    outlineWidth: {
      6: `6px`,
    },
    outlineOffset: {
      6: `6px`,
    },
  },
  plugins: [
    forms,
    scrollbar,
    plugin(function ({ theme, addComponents }) {
      addComponents({
        // Widget
        '.widget': {
          alignItems: `center`,
          border: `1px solid ${theme('colors.base-24')}`,
          borderRadius: theme('borderRadius.25'),
          backgroundColor: theme('colors.base'),
          color: theme('colors.base-94'),
          display: `flex`,
          height: theme('spacing.200r'),
          justifyContent: `start`,
          lineHeight: theme('lineHeight.100r'),
          'padding-left': theme('spacing.50r'),
          'padding-right': theme('spacing.50r'),
          width: `100%`,
        }, 
        '.widget:focus': {
          outline: '0',
          boxShadow: 'none',
        },
        '.widget:focus-within': { border: `1px solid ${theme('colors.accent')}` },
        '.widget:hover': { border: `1px solid ${theme('colors.accent')}` },
        
        // Icon
        '.icon': {
          width: theme('spacing.100r'),
          height: theme('spacing.100r'),
          strokeWidth: '2',
        },
        '.input': {
          width: `100%`,
          backgroundColor: `transparent`,
          lineHeight: theme('lineHeight.100r'),
          padding: `0`,
          fontSize: theme('fontSize.100r'),
          border: `0`,
          outline: `0`,
          boxShadow: `none`,
        },
        '.input:focus': {
          outline: `0`,
          boxShadow: `none`,
        },
      })
    }),
  ],
} satisfies Config
