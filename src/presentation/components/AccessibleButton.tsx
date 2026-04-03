import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '../theme/ThemeProvider'

interface Props {
  label: string
  onPress: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  icon?: React.ReactNode
}

export function AccessibleButton({ label, onPress, loading, variant = 'primary', disabled, icon }: Props) {
  const { colors, fontSize, letterSpacing, minTouch } = useTheme()

  const bgColor = {
    primary:   colors.primary,
    secondary: colors.surface,
    danger:    colors.error,
  }[variant]

  const textColor = variant === 'secondary' ? colors.text : colors.textOnPrimary

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
        : <View style={styles.content}>{icon}{icon && <View style={{ width: 8 }} />}<Text style={{ fontSize: fontSize.label, color: textColor, fontWeight: '700', letterSpacing }}>{label}</Text></View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})