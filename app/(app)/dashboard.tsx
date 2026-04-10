import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../src/store/authStore";
import { useTaskStore } from "../../src/store/taskStore";
import { usePreferencesStore } from "../../src/store/preferencesStore";
import { useTheme } from "../../src/presentation/theme/ThemeProvider";

import { getNextTask } from "../../src/shared/helpers/getNextTask";
import { formatDatePtBR, formatTimePtBR, formatFullDatePtBR } from "../../src/shared/helpers/formatDate";

import { AccessibleButton } from "../../src/presentation/components/AccessibleButton";
import {
  PageHeader,
  ScreenShell,
} from "../../src/presentation/components/PageHeader";
import { TaskModal } from "../../src/presentation/components/tasks/TaskModal";
import { ConfirmDialog } from "../../src/presentation/components/ConfirmDialog";

import Task from "../../src/domain/entities/Task";
import TaskList from "./activities/components/TaskList";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { preferences } = usePreferencesStore();
  const { colors, fontSize, spacing, letterSpacing, isHighContrast } =
    useTheme();
  const router = useRouter();

  const {
    tasks,
    isLoading,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    setTasks,
  } = useTaskStore();
  const simplificado = preferences.navMode === "basic";

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);

  function openCreate() {
    setSelectedTask(null);
    setModalMode("create");
    setModalVisible(true);
  }

  async function handleComplete(task: Task) {
    if (completingId) return;
    setCompletingId(task.id);
    const prevTasks = tasks;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, completed: true, concludedAt: new Date() }
          : t,
      ),
    );
    try {
      await completeTask(task);
    } catch (e) {
      setTasks(prevTasks);
      console.warn('Erro ao concluir tarefa:', e);
    } finally {
      setCompletingId(null);
    }
  }

  async function handleSaveTask(data: {
    title: string;
    notes: string | null;
    expectedToBeDone: string | null;
  }) {
    if (!user) return;

    setModalVisible(false);

    if (modalMode === "create") {
      await createTask({
        userId: user.id,
        title: data.title,
        notes: data.notes,
        expectedToBeDone: data.expectedToBeDone,
      });
    } else if (selectedTask) {
      await updateTask({
        ...selectedTask,
        title: data.title,
        notes: data.notes,
        expectedToBeDone: data.expectedToBeDone,
      });
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const prevTasks = tasks;
    const targetId = deleteTarget.id;
    setTasks((prev) => prev.filter((t) => t.id !== targetId));
    setDeleteTarget(null);
    try {
      await deleteTask(targetId);
    } catch (e) {
      setTasks(prevTasks);
      console.warn('Erro ao excluir tarefa:', e);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (user) {
      loadTasks(user.id);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    if (user) {
      await loadTasks(user.id);
    }
  }, [user]);

  function setEditOpen(open: boolean) {
    if (!open) setModalVisible(false);
  }

  function setSelectedTaskId(id: string | null) {
    const task = tasks.find((t) => t.id === id) || null;
    setSelectedTask(task);

    if (task) {
      setModalMode("edit");
      setModalVisible(true);
    }
  }

  // Dados derivados
  const next = getNextTask(tasks);

  const tarefasHoje = tasks.filter((t) => {
    if (t.completed || !t.expectedToBeDone) return false;
    const d = new Date(t.expectedToBeDone);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const history = tasks.filter((t) => t.completed);

  // Estatísticas semanais
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Domingo
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const tarefasSemana = tasks.filter((t) => {
    if (!t.expectedToBeDone) return false;
    const d = new Date(t.expectedToBeDone);
    return d >= startOfWeek && d <= endOfWeek;
  });

  const concluidasSemana = tarefasSemana.filter((t) => t.completed);
  const pendentesSemana = tarefasSemana.filter((t) => !t.completed);
  const pctSemana = tarefasSemana.length > 0 ? Math.round((concluidasSemana.length / tarefasSemana.length) * 100) : 0;

  const pendentes = tasks.filter((t) => !t.completed);
  const sorted = [...pendentes].sort((a, b) => {
    const da = a.expectedToBeDone ? new Date(a.expectedToBeDone).getTime() : Infinity;
    const db = b.expectedToBeDone ? new Date(b.expectedToBeDone).getTime() : Infinity;
    return da - db;
  });

  return (
    <ScreenShell>
      <PageHeader
        rightAction={
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile")}
            style={styles.profileBtn}
          >
          </TouchableOpacity>
        }
        onEditUser={() => router.push('/(app)/profile')}
        onLogout={() => router.replace('/(auth)/login')}
      >
        <Text
          style={[
            styles.headerGreeting,
            { fontSize: fontSize.title + 2, color: colors.textOnPrimary, letterSpacing },
          ]}
        >
          Olá, {user?.name ?? "Usuário"}!
        </Text>
        <Text
          style={[
            styles.headerDate,
            { fontSize: fontSize.body, color: colors.textOnPrimary, opacity: 0.8, letterSpacing },
          ]}
        >
          {formatFullDatePtBR()}
        </Text>
      </PageHeader>

      <ScrollView
        style={[styles.body, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Info do dia */}
        <View style={[styles.dayInfo, { backgroundColor: colors.surface, borderLeftColor: colors.primary, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Text style={[styles.dayInfoText, { fontSize: fontSize.body, color: colors.text, letterSpacing }]}>
            Você tem{' '}
            <Text style={{ fontWeight: '800', color: colors.primary, letterSpacing }}>{tarefasHoje.length}</Text>
            {' '}{tarefasHoje.length === 1 ? 'tarefa' : 'tarefas'} para hoje
          </Text>
        </View>

        {/* Próxima tarefa */}
        <View style={[styles.nextCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.nextLabel, { fontSize: fontSize.caption, color: colors.textOnPrimary, opacity: 0.7, letterSpacing }]}>PRÓXIMA TAREFA</Text>
          <Text style={[styles.nextTitle, { fontSize: fontSize.label + 2, color: colors.textOnPrimary, letterSpacing }]} numberOfLines={2}>
            {next?.task.title ?? "Nenhuma tarefa agendada"}
          </Text>
          {next && (
            <View style={styles.chipRow}>
              <View style={[styles.chip, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="time-outline" size={14} color={colors.textOnPrimary} />
                <Text style={[styles.chipText, { fontSize: fontSize.caption, color: colors.textOnPrimary, letterSpacing }]}> {formatTimePtBR(next.date)}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: isHighContrast ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>
                <Ionicons name="calendar-outline" size={14} color={colors.textOnPrimary} />
                <Text style={[styles.chipText, { fontSize: fontSize.caption, color: colors.textOnPrimary, letterSpacing }]}> {formatDatePtBR(next.date)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Criar */}
        <AccessibleButton
          label="+ Criar Nova Tarefa"
          onPress={openCreate}
          variant="gradient"
        />
        <View style={{ height: 16 }} />

        {/* Estatísticas semanais */}
        <View style={[styles.weekStats, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
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
                <Text style={[styles.statNumber, { color: isHighContrast ? colors.primary : '#22c55e', fontSize: fontSize.title, letterSpacing }]}>
                  {concluidasSemana.length}
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
                <Text style={[styles.statNumber, { color: isHighContrast ? colors.primary : '#eab308', fontSize: fontSize.title, letterSpacing }]}>
                  {pendentesSemana.length}
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
                {pctSemana}%
              </Text>
            </View>
            <View style={[styles.progressBg, { backgroundColor: isHighContrast ? 'rgba(26,235,255,0.15)' : 'rgba(37,99,235,0.1)' }]}>
              <View style={[styles.progressFill, { width: `${pctSemana}%`, backgroundColor: colors.primary }]} />
            </View>
          </View>
        </View>

        {/* Minhas Tarefas */}
        <Text style={[styles.sectionTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
          Minhas Tarefas
        </Text>

        {isLoading && pendentes.length === 0 && (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
        )}

        {!isLoading && pendentes.length === 0 && (
          <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
            <Ionicons name="checkmark-done-circle" size={40} color={colors.textMuted} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center', letterSpacing }}>
              Nenhuma tarefa pendente
            </Text>
          </View>
        )}

        {sorted.map((task) => {
          const dateStr = task.expectedToBeDone ? formatDatePtBR(new Date(task.expectedToBeDone)) : null;
          const timeStr = task.expectedToBeDone ? formatTimePtBR(new Date(task.expectedToBeDone)) : null;
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
              <View style={styles.taskActions}>
                <View style={{ flex: 1, marginRight: 2 }}>
                  <AccessibleButton
                    label="Concluir"
                    onPress={() => handleComplete(task)}
                    variant="outlined"
                    size="small"
                    loading={completingId === task.id}
                    disabled={completingId === task.id}
                  />
                </View>
                <View style={{ flex: 1, marginHorizontal: 2 }}>
                  <AccessibleButton
                    label="Editar"
                    onPress={() => setSelectedTaskId(task.id)}
                    variant="primary"
                    size="small"
                  />
                </View>
                {!simplificado && (
                  <View style={{ flex: 1, marginLeft: 2 }}>
                    <AccessibleButton
                      label="Excluir"
                      onPress={() => setDeleteTarget(task)}
                      variant="outlinedDanger"
                      size="small"
                    />
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Histórico */}
        {!simplificado && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: fontSize.label, color: colors.text, marginTop: 28, letterSpacing }]}>
              Histórico de Tarefas
            </Text>
            <View
              style={[styles.historyCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}
            >
              <Text style={[styles.historyCardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
                Histórico
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
                  const concluded = task.concludedAt ? new Date(String(task.concludedAt)) : null;
                  const dateLabel = concluded && !isNaN(concluded.getTime())
                    ? formatDatePtBR(concluded).toLowerCase()
                    : '';
                  return (
                  <View key={task.id}>
                    <View style={styles.historyRow}>
                      <Text style={{ fontSize: fontSize.label, color: colors.primary, fontWeight: '700', marginRight: 10, marginTop: 2 }}>✔</Text>
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
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>

      <TaskModal
        visible={modalVisible}
        mode={modalMode}
        task={selectedTask}
        onSave={handleSaveTask}
        onClose={() => setModalVisible(false)}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Confirmar exclusão"
        message={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerGreeting: {
    fontWeight: "700",
    marginBottom: 4,
  },
  headerDate: {
    textTransform: "capitalize",
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
    fontWeight: "600",
  },
  weekStats: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statsTitle: {
    fontWeight: "700",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 1,
  },
  progressSection: {
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressBg: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  nextCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextLabel: {
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  nextTitle: {
    fontWeight: "700",
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  chipText: {
    fontWeight: "600",
  },
  historyCard: {
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },
  historyCardTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  historyEmpty: {
    alignItems: "center",
    paddingVertical: 20,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  historyDivider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.3,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  taskCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  taskDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },
  taskTitle: {
    fontWeight: "700",
  },
  taskActions: {
    flexDirection: "row",
    marginTop: 12,
    gap: 6,
  },
});
