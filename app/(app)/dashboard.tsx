import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../src/store/authStore";
import { useTaskStore } from "../../src/store/taskStore";
import { usePreferencesStore } from "../../src/store/preferencesStore";
import { useTheme } from "../../src/presentation/theme/ThemeProvider";

import { getNextTask } from "../../src/shared/helpers/getNextTask";
import { formatFullDatePtBR } from "../../src/shared/helpers/formatDate";

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

    setModalVisible(false);
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
    if (!t.expectedToBeDone) return false;
    const d = new Date(t.expectedToBeDone);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });

  const history = tasks.filter((t) => t.completed);

  return (
    <ScreenShell>
      <PageHeader
        rightAction={
          <TouchableOpacity
            onPress={() => router.push("/(app)/profile")}
            style={styles.profileBtn}
          >
            <Ionicons
              name="person-circle-outline"
              size={36}
              color={colors.textOnPrimary}
            />
          </TouchableOpacity>
        }
      >
        <Text
          style={[
            styles.headerGreeting,
            { fontSize: fontSize.title + 2, color: colors.textOnPrimary },
          ]}
        >
          Olá, {user?.name ?? "Usuário"}!
        </Text>
        <Text
          style={[
            styles.headerDate,
            { fontSize: fontSize.body, color: colors.textOnPrimary },
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
        <View style={[styles.dayInfo, { backgroundColor: colors.surface }]}>
          <Text style={{ color: colors.text }}>
            Você tem {tarefasHoje.length} tarefas para hoje
          </Text>
        </View>

        {/* Próxima tarefa */}
        <View style={[styles.nextCard, { backgroundColor: colors.primary }]}>
          <Text style={{ color: colors.textOnPrimary }}>
            {next?.task.title ?? "Nenhuma tarefa"}
          </Text>
        </View>

        {/* Criar */}
        <AccessibleButton
          label="+ Criar Nova Tarefa"
          onPress={openCreate}
          variant="primary"
        />

        {/* Ver todas as tarefas */}
        <View style={{ marginTop: 12 }}>
          <AccessibleButton
            label="Ver Todas as Tarefas"
            onPress={() => router.push("/(app)/tasks")}
            variant="secondary"
          />
        </View>

        {/* 🔥 TASK LIST AQUI */}
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          setEditOpen={setEditOpen}
          setSelectedTaskId={setSelectedTaskId}
          showEditButton={!simplificado}
          onDeleteSuccess={onRefresh}
        />

        {/* Histórico */}
        {!simplificado && (
          <View
            style={[styles.historyCard, { backgroundColor: colors.surface }]}
          >
            <Text style={{ color: colors.text }}>Histórico</Text>
            {history.map((task) => (
              <Text key={task.id} style={{ color: colors.textMuted }}>
                ✔ {task.title}
              </Text>
            ))}
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
        message={`Excluir "${deleteTarget?.title}"?`}
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
  headerGreeting: {
    fontWeight: "700",
  },
  headerDate: {},
  body: { flex: 1 },
  dayInfo: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  nextCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  historyCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
  },
});
