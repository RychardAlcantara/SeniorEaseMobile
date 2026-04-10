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

export function ConfirmDialog({ visible, title, message, confirmLabel = 'Excluir', cancelLabel = 'Cancelar', confirmVariant = 'danger', loading, onConfirm, onCancel }: Props) {
  const { colors, fontSize, spacing, letterSpacing, isHighContrast } = useTheme()

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.card, {
          backgroundColor: colors.background,
          padding: spacing.section,
          borderColor: isHighContrast ? '#FF4D4F' : 'transparent',
          borderWidth: isHighContrast ? 2 : 0,
        }]}>
          <Text style={{ fontSize: fontSize.title, color: colors.text, fontWeight: '700', marginBottom: 12, letterSpacing }}>
            {title}
          </Text>
          <Text style={{ fontSize: fontSize.body, color: colors.textMuted, marginBottom: 28, lineHeight: fontSize.body * 1.5, letterSpacing }}>
            {message}
          </Text>
          <View style={styles.actions}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <AccessibleButton label={cancelLabel} onPress={onCancel} variant="secondary" disabled={loading} />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <AccessibleButton label={loading ? 'Excluindo...' : confirmLabel} onPress={onConfirm} variant={confirmVariant} loading={loading} disabled={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  card:    { borderRadius: 16 },
  actions: { flexDirection: 'row' },
})