import React from 'react'
import { Modal, View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { AccessibleButton } from './AccessibleButton'

interface Props {
  visible: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ visible, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', confirmVariant = 'primary', loading, onConfirm, onCancel }: Props) {
  const { colors, fontSize, spacing, letterSpacing, isHighContrast } = useTheme()

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.background, padding: spacing.section, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={{ fontSize: fontSize.title, color: colors.text, fontWeight: '700', marginBottom: 12, letterSpacing }}>
            {title}
          </Text>
          <Text style={{ fontSize: fontSize.body, color: colors.textMuted, marginBottom: 28, lineHeight: fontSize.body * 1.5, letterSpacing }}>
            {message}
          </Text>
          <AccessibleButton label={confirmLabel} onPress={onConfirm} variant={confirmVariant} loading={loading} disabled={loading} />
          <View style={{ height: 12 }} />
          <AccessibleButton label={cancelLabel} onPress={onCancel} variant="secondary" disabled={loading} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  card:    { borderRadius: 16 },
})