export const fontSizeScale = {
  small:  { body: 14, title: 18, label: 12, caption: 10 },
  medium: { body: 16, title: 22, label: 14, caption: 12 },
  large:  { body: 20, title: 28, label: 18, caption: 14 },
}

export const spacingScale = {
  normal:  { base: 12, item: 16, section: 28, screen: 20 },
  relaxed: { base: 16, item: 24, section: 40, screen: 28 },
}

export const letterSpacingScale = {
  normal:  0,
  relaxed: 1.5,
}

// WCAG 2.5.5 mínimo 44dp — para idosos usamos 56dp
export const minTouchTarget = 56

export const borderRadius = {
  sm: 8, md: 12, lg: 16, full: 999,
}