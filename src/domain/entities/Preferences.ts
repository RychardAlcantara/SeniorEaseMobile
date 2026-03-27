export interface Preferences {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge'
  contrastLevel: 'normal' | 'high' | 'highest'
  spacing: 'compact' | 'normal' | 'relaxed'
  navMode: 'basic' | 'advanced'
  reinforcedVisualFeedback: boolean
  requireExtraConfirmation: boolean
  remindersEnabled: boolean
}

export const defaultPreferences: Preferences = {
  fontSize: 'large',
  contrastLevel: 'high',
  spacing: 'relaxed',
  navMode: 'basic',
  reinforcedVisualFeedback: true,
  requireExtraConfirmation: true,
  remindersEnabled: true,
}