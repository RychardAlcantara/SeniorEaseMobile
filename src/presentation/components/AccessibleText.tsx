import React from 'react'
import { Text, TextProps } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'

interface Props extends TextProps {
  variant?: 'title' | 'body' | 'label' | 'caption'
  muted?: boolean
}

export function AccessibleText({ variant = 'body', muted, style, ...props }: Props) {
  const { colors, fontSize } = useTheme()
  return (
    <Text
      style={[{
        fontSize: fontSize[variant],
        color: muted ? colors.textMuted : colors.text,
        lineHeight: fontSize[variant] * 1.5,
      }, style]}
      {...props}
    />
  )
}