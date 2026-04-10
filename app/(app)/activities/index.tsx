import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../../src/store/authStore";
import { useTaskStore } from "../../../src/store/taskStore";
import { usePreferencesStore } from "../../../src/store/preferencesStore";
import { useTheme } from "../../../src/presentation/theme/ThemeProvider";
import { formatDatePtBR } from "../../../src/shared/helpers/formatDate";

import { AccessibleButton } from "../../../src/presentation/components/AccessibleButton";
import {
  PageHeader,
  ScreenShell,
} from "../../../src/presentation/components/PageHeader";
import { TaskModal } from "../../../src/presentation/components/tasks/TaskModal";
import { ConfirmDialog } from "../../../src/presentation/components/ConfirmDialog";

import Task from "../../../src/domain/entities/Task";
import TaskList from "./components/TaskList";

export default function ActivitiesScreen() {
  const { user } = useAuthStore();
  const { preferences } = usePreferencesStore();
  const { colors, fontSize, letterSpacing, isHighContrast, minTouch } = useTheme();
  const router = useRouter();

  const simplificado = preferences.navMode === "basic";

  const {
    tasks,
    isLoading,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    setTasks,
  } = useTaskStore();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filter/Sort state
  const [tab, setTab] = useState<"pending" | "completed">("pending");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");

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

  function openCreate() {
    setSelectedTask(null);
    setModalMode("create");
    setModalVisible(true);
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
    try {
      await deleteTask(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

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

  // Filter and sort
  function ordenarPorData(lista: Task[]) {
    return lista.slice().sort((a, b) => {
      const da = a.expectedToBeDone
        ? new Date(a.expectedToBeDone).getTime()
        : Infinity;
      const db = b.expectedToBeDone
        ? new Date(b.expectedToBeDone).getTime()
        : Infinity;
      return orderBy === "asc" ? da - db : db - da;
    });
  }

  const filtro = search.trim().toLowerCase();
  const pendentes = tasks.filter((t) => !t.completed);
  const concluidas = tasks.filter((t) => t.completed);

  const pendentesFiltradas = ordenarPorData(
    filtro
      ? pendentes.filter((t) => t.title.toLowerCase().includes(filtro))
      : pendentes,
  );

  const concluidasFiltradas = ordenarPorData(
    filtro
      ? concluidas.filter((t) => t.title.toLowerCase().includes(filtro))
      : concluidas,
  );

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
      >
        <View style={styles.headerContent}>
          <Text
            style={[
              styles.headerTitle,
              { fontSize: fontSize.title + 2, color: colors.textOnPrimary },
            ]}
          >
            Tarefas
          </Text>
        </View>
      </PageHeader>

      <ScrollView
        style={[styles.body, { backgroundColor: colors.background }]}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        {/* Criar button */}
        <View style={styles.createContainer}>
          <AccessibleButton
            label="+ Criar Nova Tarefa"
            onPress={openCreate}
            variant="gradient"
          />
        </View>

        {/* Search */}
        {!simplificado && (
          <View
            style={[
              styles.searchBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="search"
              size={20}
              color={colors.textMuted}
            />
            <TextInput
              placeholder="Buscar tarefas..."
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              style={[styles.searchInput, { color: colors.text, fontSize: fontSize.body, letterSpacing }]}
            />
          </View>
        )}

        {/* Sort */}
        {!simplificado && (
          <View style={styles.sortContainer}>
            <Text style={[styles.sortLabel, { color: colors.text, fontSize: fontSize.caption, letterSpacing }]}>
              Ordenar por:
            </Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                onPress={() => setOrderBy("asc")}
                style={[
                  styles.sortBtn,
                  orderBy === "asc"
                    ? { backgroundColor: colors.primary }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    {
                      fontSize: fontSize.caption,
                      letterSpacing,
                      color:
                        orderBy === "asc" ? colors.textOnPrimary : colors.text,
                    },
                  ]}
                >
                  Mais antigas
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOrderBy("desc")}
                style={[
                  styles.sortBtn,
                  orderBy === "desc"
                    ? { backgroundColor: colors.primary }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                      },
                ]}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    {
                      fontSize: fontSize.caption,
                      letterSpacing,
                      color:
                        orderBy === "desc" ? colors.textOnPrimary : colors.text,
                    },
                  ]}
                >
                  Mais recentes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Tabs */}
        <View
          style={[styles.tabsContainer, { borderBottomColor: colors.border }]}
        >
          <TouchableOpacity
            onPress={() => setTab("pending")}
            style={[
              styles.tab,
              tab === "pending" && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: fontSize.body,
                  letterSpacing,
                  color: tab === "pending" ? colors.primary : colors.textMuted,
                  fontWeight: tab === "pending" ? "700" : "500",
                },
              ]}
            >
              Pendentes ({pendentesFiltradas.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setTab("completed")}
            style={[
              styles.tab,
              tab === "completed" && {
                borderBottomColor: colors.primary,
                borderBottomWidth: 2,
              },
            ]}
          >
            <Text
              style={[
                styles.tabLabel,
                {
                  fontSize: fontSize.body,
                  letterSpacing,
                  color:
                    tab === "completed" ? colors.primary : colors.textMuted,
                  fontWeight: tab === "completed" ? "700" : "500",
                },
              ]}
            >
              Concluídas ({concluidasFiltradas.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {tab === "pending" ? (
          <TaskList
            tasks={pendentesFiltradas}
            setTasks={setTasks}
            setEditOpen={setEditOpen}
            setSelectedTaskId={setSelectedTaskId}
            showEditButton={!simplificado}
            onDeleteSuccess={onRefresh}
            onDeleteRequest={setDeleteTarget}
          />
        ) : (
          <View
            style={[
              styles.historyContainer,
              { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 },
            ]}
          >
            <Text style={[styles.historyCardTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}>
              Histórico de Tarefas
            </Text>

            {concluidasFiltradas.length === 0 ? (
              <View style={styles.historyEmpty}>
                <Ionicons name="document-text-outline" size={32} color={colors.textMuted} style={{ marginBottom: 8 }} />
                <Text style={[styles.emptyText, { color: colors.textMuted, letterSpacing }]}>
                  Nenhuma tarefa concluída ainda.
                </Text>
              </View>
            ) : (
              concluidasFiltradas.map((task, index) => {
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
                    {index < concluidasFiltradas.length - 1 && (
                      <View style={[styles.historyDivider, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                );
              })
            )}
          </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "700",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  body: { flex: 1 },
  createContainer: {
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  sortContainer: {
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  sortButtons: {
    flexDirection: "row",
    gap: 8,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 0,
  },
  tabLabel: {
    fontSize: 14,
  },
  historyContainer: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  historyCardTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
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
});
