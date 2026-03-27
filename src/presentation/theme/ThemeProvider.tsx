import React, { createContext, useContext } from 'react'
import { usePreferencesStore } from '../../store/preferencesStore'
import { palette, ColorPalette } from './colors'
import { fontSizeScale, spacingScale, minTouchTarget } from './tokens'
import { Preferences } from '../../domain/entities/Preferences'

interface ThemeContextValue {
  colors: ColorPalette
  fontSize: typeof fontSizeScale.large
  spacing: typeof spacingScale.relaxed
  minTouch: number
  preferences: Preferences
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences } = usePreferencesStore()

  const value: ThemeContextValue = {
    colors:      palette[preferences.contrastLevel],
    fontSize:    fontSizeScale[preferences.fontSize],
    spacing:     spacingScale[preferences.spacing],
    minTouch:    minTouchTarget,
    preferences,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  return ctx
}