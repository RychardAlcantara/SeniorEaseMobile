import React, { useState, useEffect } from 'react'
import {
  View, Text, TextInput, StyleSheet, Modal, ScrollView,
  KeyboardAvoidingView, Platform, TouchableOpacity, Pressable,
} from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../theme/ThemeProvider'
import { AccessibleButton } from '../AccessibleButton'
import { Task } from '../../../domain/entities/Task'
import { formatDatePtBR, formatTimePtBR } from '../../../shared/helpers/formatDate'

interface Props {
  visible: boolean
  mode: 'create' | 'edit'
  task?: Task | null
  onSave: (data: { title: string; notes: string | null; expectedToBeDone: string | null }) => Promise<void>
  onClose: () => void
}

export function TaskModal({ visible, mode, task, onSave, onClose }: Props) {
  const { colors, fontSize, letterSpacing, isHighContrast, minTouch } = useTheme()

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && task) {
        setTitle(task.title)
        setNotes(task.notes ?? '')
        setDate(task.expectedToBeDone ? new Date(task.expectedToBeDone) : null)
      } else {
        setTitle('')
        setNotes('')
        setDate(null)
      }
      setSaving(false)
    }
  }, [visible, mode, task])

  function onDateChange(_: DateTimePickerEvent, selected?: Date) {
    setShowDatePicker(false)
    if (selected) {
      const merged = date ? new Date(date) : new Date()
      merged.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate())
      setDate(merged)
      // After picking date, show time picker
      setTimeout(() => setShowTimePicker(true), 300)
    }
  }

  function onTimeChange(_: DateTimePickerEvent, selected?: Date) {
    setShowTimePicker(false)
    if (selected) {
      const merged = date ? new Date(date) : new Date()
      merged.setHours(selected.getHours(), selected.getMinutes())
      setDate(merged)
    }
  }

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        notes: notes.trim() || null,
        expectedToBeDone: date ? date.toISOString() : null,
      })
    } finally {
      setSaving(false)
    }
  }

  const hcBorder = isHighContrast ? colors.border : 'transparent'
  const hcWidth = isHighContrast ? 1 : 0

  const modalTitle = mode === 'create' ? 'Criar Nova Tarefa' : 'Editar Tarefa'
  const saveLabel = mode === 'create' ? 'Criar' : 'Salvar'
  const saveIcon = mode === 'create' ? 'add-circle' : 'checkmark-circle'

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avoidView}
        >
          <Pressable
            style={[styles.card, { backgroundColor: colors.surface, borderColor: hcBorder, borderWidth: hcWidth }]}
            onPress={() => {}} // prevent closing when touching the card
          >
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { fontSize: fontSize.title, color: colors.text, letterSpacing }]}>
                  {modalTitle}
                </Text>
                <TouchableOpacity onPress={onClose} accessibilityLabel="Fechar" accessibilityRole="button">
                  <Ionicons name="close-circle" size={28} color={colors.textMuted} />
                </TouchableOpacity>
              </View>

              {/* Título */}
              <Text style={[styles.label, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
                Título da Tarefa
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Tomar remédio"
                placeholderTextColor={colors.textMuted}
                editable={!saving}
                style={[styles.input, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text, fontSize: fontSize.body, minHeight: minTouch, letterSpacing }]}
              />

              {/* Observações */}
              <Text style={[styles.label, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
                Observações
              </Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Detalhes opcionais"
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={3}
                editable={!saving}
                style={[styles.input, styles.textArea, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text, fontSize: fontSize.body, letterSpacing }]}
              />

              {/* Data/Hora */}
              <Text style={[styles.label, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
                Para quando é a tarefa?
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                disabled={saving}
                style={[styles.input, styles.dateBtn, { borderColor: colors.border, backgroundColor: colors.background, minHeight: minTouch }]}
                accessibilityRole="button"
                accessibilityLabel="Selecionar data e hora"
              >
                <Ionicons name="calendar" size={20} color={colors.primary} style={{ marginRight: 10 }} />
                <Text style={{ fontSize: fontSize.body, color: date ? colors.text : colors.textMuted, flex: 1, letterSpacing }}>
                  {date
                    ? `${formatDatePtBR(date)} às ${formatTimePtBR(date)}`
                    : 'Toque para selecionar'}
                </Text>
                {date && (
                  <TouchableOpacity onPress={() => setDate(null)} accessibilityLabel="Limpar data">
                    <Ionicons name="close-circle" size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="date"
                  display="default"
                  locale="pt-BR"
                  themeVariant={isHighContrast ? 'dark' : 'light'}
                  accentColor={colors.primary}
                  onChange={onDateChange}
                />
              )}
              {showTimePicker && (
                <DateTimePicker
                  value={date ?? new Date()}
                  mode="time"
                  is24Hour
                  display="default"
                  locale="pt-BR"
                  themeVariant={isHighContrast ? 'dark' : 'light'}
                  accentColor={colors.primary}
                  onChange={onTimeChange}
                />
              )}

              {/* Ações */}
              <View style={styles.actions}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <AccessibleButton
                    label="Cancelar"
                    onPress={onClose}
                    variant="secondary"
                    disabled={saving}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <AccessibleButton
                    label={saving ? 'Salvando...' : saveLabel}
                    onPress={handleSave}
                    loading={saving}
                    disabled={!title.trim() || saving}
                    variant="primary"
                    icon={<Ionicons name={saveIcon} size={18} color={colors.textOnPrimary} />}
                  />
                </View>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  avoidView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontWeight: '700',
    flex: 1,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
  },
})
