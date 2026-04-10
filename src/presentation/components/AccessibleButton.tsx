import React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { useTheme } from '../theme/ThemeProvider'

interface Props {
  label: string
  onPress: () => void
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'outlined' | 'outlinedDanger' | 'gradient'
  disabled?: boolean
  icon?: React.ReactNode
  size?: 'default' | 'small'
}

export function AccessibleButton({ label, onPress, loading, variant = 'primary', disabled, icon, size = 'default' }: Props) {
  const { colors, fontSize, letterSpacing, minTouch, isHighContrast } = useTheme()
  const isSmall = size === 'small'

  const isOutlined = variant === 'outlined' || variant === 'outlinedDanger'
  const isGradient = variant === 'gradient'

  const bgColor = isGradient
    ? 'transparent'
    : isOutlined
      ? 'transparent'
      : { primary: colors.primary, secondary: colors.surface, danger: colors.error }[variant as 'primary' | 'secondary' | 'danger']

  const borderColor = variant === 'outlined'
    ? colors.primary
    : variant === 'outlinedDanger'
      ? colors.error
      : 'transparent'

  const textColor = isGradient
    ? '#ffffff'
    : variant === 'outlined'
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

  const buttonContent = loading
    ? <ActivityIndicator color={textColor} size={isSmall ? 'small' : 'small'} />
    : <View style={styles.content}>{icon}{icon && <View style={{ width: 8 }} />}<Text style={{ fontSize: isSmall ? fontSize.caption : fontSize.label, color: textColor, fontWeight: '700', letterSpacing }}>{label}</Text></View>

  if (isGradient && !isHighContrast) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled || loading}
        accessible
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || loading }}
        style={{ opacity: disabled ? 0.5 : 1, width: '100%' }}
      >
        <LinearGradient
          colors={['#00b0ff', '#3a7bd5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, {
            minHeight: isSmall ? 36 : minTouch,
            paddingHorizontal: isSmall ? 8 : 12,
            paddingVertical: isSmall ? 4 : 8,
          }]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    )
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
      {buttonContent}
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