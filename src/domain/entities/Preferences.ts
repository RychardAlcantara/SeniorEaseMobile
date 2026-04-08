export interface Preferences {
  fontSize: 'small' | 'medium' | 'large'
  contrastLevel: 'normal' | 'high'
  spacing: 'normal' | 'relaxed'
  navMode: 'basic' | 'advanced'
  reinforcedVisualFeedback: boolean
  requireExtraConfirmation: boolean
  remindersEnabled: boolean
}

export const defaultPreferences: Preferences = {
  fontSize: 'medium',
  contrastLevel: 'normal',
  spacing: 'normal',
  navMode: 'advanced',
  reinforcedVisualFeedback: true,
  requireExtraConfirmation: true,
  remindersEnabled: true,
}