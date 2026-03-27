import React from 'react'
import { Modal, View, Text, StyleSheet } from 'react-native'
import { useTheme } from '../theme/ThemeProvider'
import { AccessibleButton } from './AccessibleButton'

interface Props {
  visible: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ visible, title, message, onConfirm, onCancel }: Props) {
  const { colors, fontSize, spacing } = useTheme()

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.background, padding: spacing.section }]}>
          <Text style={{ fontSize: fontSize.title, color: colors.text, fontWeight: '700', marginBottom: 12 }}>
            {title}
          </Text>
          <Text style={{ fontSize: fontSize.body, color: colors.textMuted, marginBottom: 28, lineHeight: fontSize.body * 1.5 }}>
            {message}
          </Text>
          <AccessibleButton label="Confirmar" onPress={onConfirm} variant="primary" />
          <View style={{ height: 12 }} />
          <AccessibleButton label="Cancelar"  onPress={onCancel}  variant="secondary" />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  card:    { borderRadius: 16 },
})