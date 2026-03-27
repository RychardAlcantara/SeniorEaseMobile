export const fontSizeScale = {
  small:  { body: 16, title: 20, label: 14, caption: 12 },
  medium: { body: 20, title: 24, label: 18, caption: 14 },
  large:  { body: 24, title: 30, label: 22, caption: 16 },
  xlarge: { body: 30, title: 38, label: 28, caption: 20 },
}

export const spacingScale = {
  compact: { base: 8,  item: 12, section: 20, screen: 16 },
  normal:  { base: 12, item: 16, section: 28, screen: 20 },
  relaxed: { base: 16, item: 24, section: 40, screen: 28 },
}

// WCAG 2.5.5 mínimo 44dp — para idosos usamos 56dp
export const minTouchTarget = 56

export const borderRadius = {
  sm: 8, md: 12, lg: 16, full: 999,
}