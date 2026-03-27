import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '../theme/ThemeProvider'

interface Props {
  label: string
  onPress: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}

export function AccessibleButton({ label, onPress, loading, variant = 'primary', disabled }: Props) {
  const { colors, fontSize, minTouch } = useTheme()

  const bgColor = {
    primary:   colors.primary,
    secondary: colors.surface,
    danger:    colors.error,
  }[variant]

  const textColor = variant === 'secondary' ? colors.text : colors.white

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      style={[styles.base, {
        minHeight: minTouch,
        backgroundColor: bgColor,
        opacity: disabled ? 0.5 : 1,
      }]}
    >
      {loading
        ? <ActivityIndicator color={textColor} />
        : <Text style={{ fontSize: fontSize.label, color: textColor, fontWeight: '700' }}>{label}</Text>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
})