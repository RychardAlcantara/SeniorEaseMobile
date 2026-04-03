import React, { useEffect, useCallback, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, RefreshControl,
  ActivityIndicator, TouchableOpacity, Modal, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '../../src/store/authStore'
import { useTaskStore } from '../../src/store/taskStore'
import { usePreferencesStore } from '../../src/store/preferencesStore'
import { useTheme } from '../../src/presentation/theme/ThemeProvider'
import { getNextTask } from '../../src/shared/helpers/getNextTask'
import { formatDatePtBR, formatTimePtBR, formatFullDatePtBR } from '../../src/shared/helpers/formatDate'
import { AccessibleButton } from '../../src/presentation/components/AccessibleButton'
import { PageHeader, ScreenShell } from '../../src/presentation/components/PageHeader'

export default function DashboardScreen() {
  const { user } = useAuthStore()
  const { tasks, history, isLoading, loadTasks, loadHistory, completeTask, createTask } = useTaskStore()
  const { preferences } = usePreferencesStore()
  const { colors, fontSize, spacing, letterSpacing, isHighContrast } = useTheme()
  const router = useRouter()

  const simplificado = preferences.navMode === 'basic'

  const [modalVisible, setModalVisible] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newDate, setNewDate] = useState('')
  const [creating, setCreating] = useState(false)

  async function handleCreateTask() {
    if (!user || !newTitle.trim()) return
    setCreating(true)
    try {
      let parsedDate: string | null = null
      if (newDate.trim()) {
        const match = newDate.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/)
        if (match) {
          const [, dd, mm, yyyy, hh, min] = match
          parsedDate = new Date(+yyyy, +mm - 1, +dd, +hh, +min).toISOString()
        }
      }
      await createTask({
        userId: user.id,
        title: newTitle.trim(),
        notes: newNotes.trim() || null,
        expectedToBeDone: parsedDate,
      })
      setNewTitle('')
      setNewNotes('')
      setNewDate('')
      setModalVisible(false)
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadTasks(user.id)
      loadHistory(user.id)
    }
  }, [user])

  const onRefresh = useCallback(async () => {
    if (user) {
      await Promise.all([loadTasks(user.id), loadHistory(user.id)])
    }
  }, [user])

  const next = getNextTask(tasks)
  const tarefasHoje = tasks.filter((t) => {
    if (!t.expectedToBeDone) return false
    const d = new Date(t.expectedToBeDone)
    const now = new Date()
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  const pendentes = tasks.filter((t) => !t.completed)
  const concluidas = history.length
  const total = pendentes.length + concluidas
  const pct = total > 0 ? Math.round((concluidas / total) * 100) : 0

  const sorted = [...pendentes].sort((a, b) => {
    const da = a.expectedToBeDone ? new Date(a.expectedToBeDone).getTime() : Infinity
    const db = b.expectedToBeDone ? new Date(b.expectedToBeDone).getTime() : Infinity
    return da - db
  })

  return (
    <ScreenShell>
      <PageHeader
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/(app)/profile')}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Perfil"
            style={styles.profileBtn}
          >
            <Ionicons name="person-circle-outline" size={36} color={colors.textOnPrimary} />
          </TouchableOpacity>
        }
      >
        <Text style={[styles.headerGreeting, { fontSize: fontSize.title + 2, color: colors.textOnPrimary, letterSpacing }]}>
          Olá, {user?.name ?? user?.email?.split('@')[0] ?? 'Usuário'}!
        </Text>
        <Text style={[styles.headerDate, { fontSize: fontSize.body, color: colors.textOnPrimary, opacity: 0.8, letterSpacing }]}>
          {formatFullDatePtBR()}
        </Text>
      </PageHeader>

      {/* ── Conteúdo ── */}
      <ScrollView
        style={[styles.body, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
      >
        {/* Info do dia */}
        <View style={[styles.dayInfo, { backgroundColor: colors.surface, borderLeftColor: colors.primary, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.dayInfoText, { fontSize: fontSize.body, color: colors.text, letterSpacing }]}>
            Você tem{' '}
            <Text style={{ fontWeight: '800', color: colors.primary, letterSpacing }}>{tarefasHoje.length}</Text>
            {' '}{tarefasHoje.length === 1 ? 'tarefa' : 'tarefas'} para hoje
          </Text>
        </View>

        {/* Próxima Tarefa */}
        <View style={[styles.nextCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.nextLabel, { fontSize: fontSize.caption, color: colors.textOnPrimary, opacity: 0.7, letterSpacing }]}>PRÓXIMA TAREFA</Text>
          <Text style={[styles.nextTitle, { fontSize: fontSize.label + 2, color: colors.textOnPrimary, letterSpacing }]} numberOfLines={2}>
            {next?.task.title ?? 'Nenhuma tarefa agendada'}
          </Text>
          {next && (
            <View style={styles.chipRow}>
              <View style={[styles.chip, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="time-outline" size={14} color={colors.textOnPrimary} /><Text style={[styles.chipText, { fontSize: fontSize.caption, color: colors.textOnPrimary, letterSpacing }]}> {formatTimePtBR(next.date)}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="calendar-outline" size={14} color={colors.textOnPrimary} /><Text style={[styles.chipText, { fontSize: fontSize.caption, color: colors.textOnPrimary, letterSpacing }]}> {formatDatePtBR(next.date)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Criar nova tarefa */}
        <AccessibleButton
          label="+ Criar Nova Tarefa"
          onPress={() => setModalVisible(true)}
          variant="primary"
        />
        <View style={{ height: 16 }} />

        {/* Estatística Semanal (somente avançado) */}
        {!simplificado && (
          <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
            <Text style={[styles.statsTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
              Estatística Semanal
            </Text>
            <View style={styles.statsRow}>
              {/* Concluídas */}
              <View style={[styles.statChip, isHighContrast
                ? { backgroundColor: 'transparent', borderColor: colors.border }
                : { backgroundColor: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }
              ]}>
                <View style={[styles.statIconCircle, { backgroundColor: isHighContrast ? 'rgba(26,235,255,0.15)' : 'rgba(34,197,94,0.15)' }]}>
                  <Ionicons name="checkmark-circle" size={20} color={isHighContrast ? colors.primary : '#22c55e'} />
                </View>
                <View>
                  <Text style={[styles.statNum, { color: isHighContrast ? colors.primary : '#22c55e', fontSize: fontSize.title, letterSpacing }]}>
                    {concluidas}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>
                    Concluídas
                  </Text>
                </View>
              </View>
              {/* Pendentes */}
              <View style={[styles.statChip, isHighContrast
                ? { backgroundColor: 'transparent', borderColor: colors.border }
                : { backgroundColor: 'rgba(234,179,8,0.08)', borderColor: 'rgba(234,179,8,0.2)' }
              ]}>
                <View style={[styles.statIconCircle, { backgroundColor: isHighContrast ? 'rgba(26,235,255,0.15)' : 'rgba(234,179,8,0.15)' }]}>
                  <Ionicons name="time" size={20} color={isHighContrast ? colors.primary : '#eab308'} />
                </View>
                <View>
                  <Text style={[styles.statNum, { color: isHighContrast ? colors.primary : '#eab308', fontSize: fontSize.title, letterSpacing }]}>
                    {pendentes.length}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: fontSize.caption, letterSpacing }]}>
                    Pendentes
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressLabelRow}>
                <Text style={{ fontSize: fontSize.caption, color: colors.textMuted, fontWeight: '600', letterSpacing }}>
                  Progresso da semana
                </Text>
                <Text style={{ fontSize: fontSize.caption, color: colors.primary, fontWeight: '700', letterSpacing }}>
                  {pct}%
                </Text>
              </View>
              <View style={[styles.progressBg, { backgroundColor: isHighContrast ? 'rgba(26,235,255,0.15)' : 'rgba(37,99,235,0.1)' }]}>
                <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: colors.primary }]} />
              </View>
            </View>
          </View>
        )}

        {/* Minhas Tarefas */}
        <Text style={[styles.sectionTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
          Minhas Tarefas
        </Text>

        {isLoading && pendentes.length === 0 && (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
        )}

        {!isLoading && pendentes.length === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
            <Ionicons name="checkmark-done-circle" size={40} color={colors.success} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center', letterSpacing }}>
              Nenhuma tarefa pendente
            </Text>
          </View>
        )}

        {sorted.map((task) => {
          const dateStr = task.expectedToBeDone ? formatDatePtBR(new Date(task.expectedToBeDone)) : null
          const timeStr = task.expectedToBeDone ? formatTimePtBR(new Date(task.expectedToBeDone)) : null
          return (
            <View key={task.id} style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
              <View style={styles.taskHeader}>
                <View style={[styles.taskDot, { backgroundColor: colors.primary }]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]} numberOfLines={2}>
                    {task.title}
                  </Text>
                  {dateStr && (
                    <Text style={{ fontSize: fontSize.caption, color: colors.textMuted, marginTop: 2, letterSpacing }}>
                      <Ionicons name="calendar-outline" size={12} color={colors.textMuted} /> {dateStr}  •  <Ionicons name="time-outline" size={12} color={colors.textMuted} /> {timeStr}
                    </Text>
                  )}
                </View>
              </View>
              {task.notes ? (
                <Text style={{ fontSize: fontSize.caption, color: colors.textMuted, marginTop: 6, marginLeft: 22, letterSpacing }} numberOfLines={2}>
                  {task.notes}
                </Text>
              ) : null}
              <View style={{ marginTop: 12 }}>
                <AccessibleButton
                  label="Concluir"
                  icon={<Ionicons name="checkmark-circle-outline" size={18} color={colors.textOnPrimary} />}
                  onPress={() => user && completeTask(task.id, user.id)}
                  variant="primary"
                />
              </View>
            </View>
          )
        })}

        {/* Histórico (avançado) */}
        {!simplificado && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: fontSize.label, color: colors.text, marginTop: 28, letterSpacing }]}>
              Histórico
            </Text>
            <View style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
              <Text style={[styles.historyCardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
                Histórico de Tarefas
              </Text>

              {history.length === 0 ? (
                <View style={styles.historyEmpty}>
                  <Ionicons name="document-text-outline" size={32} color={colors.textMuted} style={{ marginBottom: 8 }} />
                  <Text style={{ fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center', letterSpacing }}>
                    Nenhuma tarefa concluída ainda.
                  </Text>
                </View>
              ) : (
                history.slice(0, 10).map((task, index) => {
                  const dateLabel = task.concludedAt
                    ? formatDatePtBR(new Date(task.concludedAt as any)).toLowerCase()
                    : ''
                  return (
                    <View key={task.id}>
                      <View style={styles.historyRow}>
                        <Ionicons name="checkmark-circle" size={18} color={colors.success} style={{ marginRight: 10, marginTop: 2 }} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: fontSize.body, color: colors.text, letterSpacing }} numberOfLines={2}>
                            {task.title}
                          </Text>
                          {dateLabel ? (
                            <Text style={{ fontSize: fontSize.caption, color: colors.textMuted, marginTop: 2, letterSpacing }}>
                              Concluído {dateLabel}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      {index < Math.min(history.length, 10) - 1 && (
                        <View style={[styles.historyDivider, { backgroundColor: colors.border }]} />
                      )}
                    </View>
                  )
                })
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal Criar Tarefa */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
            <Text style={[styles.modalTitle, { fontSize: fontSize.title, color: colors.text, letterSpacing }]}>
              Criar Nova Tarefa
            </Text>

            <Text style={[styles.modalLabel, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
              Título da Tarefa
            </Text>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder="Ex: Tomar remédio"
              placeholderTextColor={colors.textMuted}
              style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text, fontSize: fontSize.body, letterSpacing }]}
            />

            <Text style={[styles.modalLabel, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
              Observações
            </Text>
            <TextInput
              value={newNotes}
              onChangeText={setNewNotes}
              placeholder="Detalhes opcionais"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              style={[styles.modalInput, styles.modalTextArea, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text, fontSize: fontSize.body, letterSpacing }]}
            />

            <Text style={[styles.modalLabel, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
              Para quando? (DD/MM/AAAA HH:MM)
            </Text>
            <TextInput
              value={newDate}
              onChangeText={setNewDate}
              placeholder="25/12/2026 14:00"
              placeholderTextColor={colors.textMuted}
              keyboardType="default"
              style={[styles.modalInput, { borderColor: colors.border, backgroundColor: colors.background, color: colors.text, fontSize: fontSize.body, letterSpacing }]}
            />

            <View style={styles.modalActions}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <AccessibleButton
                  label="Cancelar"
                  onPress={() => setModalVisible(false)}
                  variant="secondary"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <AccessibleButton
                  label="Criar"
                  onPress={handleCreateTask}
                  loading={creating}
                  disabled={!newTitle.trim()}
                  variant="primary"
                  icon={<Ionicons name="add-circle" size={18} color={colors.textOnPrimary} />}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenShell>
  )
}

const styles = StyleSheet.create({
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerGreeting: {
    fontWeight: '700',
    marginBottom: 4,
  },
  headerDate: {
    textTransform: 'capitalize',
  },
  body: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  dayInfo: {
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  dayInfoText: {
    fontWeight: '600',
  },
  nextCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextLabel: {
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  nextTitle: {
    fontWeight: '700',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    fontWeight: '600',
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statsTitle: {
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNum: {
    fontWeight: '800',
    lineHeight: 24,
  },
  statLabel: {
    fontWeight: '500',
    marginTop: 1,
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBg: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },
  taskTitle: {
    fontWeight: '700',
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  historyCardTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  historyEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  historyDivider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: '700',
    marginBottom: 20,
  },
  modalLabel: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
  },
})