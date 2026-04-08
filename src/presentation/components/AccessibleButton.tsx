import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '../theme/ThemeProvider'

interface Props {
  label: string
  onPress: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined' | 'outlinedDanger'
  disabled?: boolean
  icon?: React.ReactNode
  size?: 'default' | 'small'
}

export function AccessibleButton({ label, onPress, loading, variant = 'primary', disabled, icon, size = 'default' }: Props) {
  const { colors, fontSize, letterSpacing, minTouch } = useTheme()
  const isSmall = size === 'small'

  const isOutlined = variant === 'outlined' || variant === 'outlinedDanger'

  const bgColor = isOutlined
    ? 'transparent'
    : { primary: colors.primary, secondary: colors.surface, danger: colors.error }[variant as 'primary' | 'secondary' | 'danger']

  const borderColor = variant === 'outlined'
    ? colors.primary
    : variant === 'outlinedDanger'
      ? colors.error
      : 'transparent'

  const textColor = variant === 'outlined'
    ? colors.primary
    : variant === 'outlinedDanger'
      ? colors.error
      : variant === 'secondary'
        ? colors.text
        : colors.textOnPrimary

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
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
        minHeight: isSmall ? 36 : minTouch,
        backgroundColor: bgColor,
        borderColor,
        borderWidth: isOutlined ? 1.5 : 0,
        opacity: disabled ? 0.5 : 1,
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 4 : 8,
      }]}
    >
      {loading
        ? <ActivityIndicator color={textColor} size={isSmall ? 'small' : 'small'} />
        : <View style={styles.content}>{icon}{icon && <View style={{ width: 8 }} />}<Text style={{ fontSize: isSmall ? fontSize.caption : fontSize.label, color: textColor, fontWeight: '700', letterSpacing }}>{label}</Text></View>
      }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})