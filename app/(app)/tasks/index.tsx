import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../../../src/store/authStore";
import { useTaskStore } from "../../../src/store/taskStore";
import { useTheme } from "../../../src/presentation/theme/ThemeProvider";
import { useContraste } from "../../../src/application/contexts/ContrasteContext";

import { AccessibleButton } from "../../../src/presentation/components/AccessibleButton";
import {
  PageHeader,
  ScreenShell,
} from "../../../src/presentation/components/PageHeader";
import { TaskModal } from "../../../src/presentation/components/tasks/TaskModal";

import Task from "../../../src/domain/entities/Task";
import TaskList from "../activities/components/TaskList";
import HistoryItem from "./HistoryItem";

export default function TasksScreen() {
  const { user } = useAuthStore();
  const { colors, fontSize, spacing } = useTheme();
  const { altoContraste } = useContraste();
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

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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
            styles.headerTitle,
            { fontSize: fontSize.title + 2, color: colors.textOnPrimary },
          ]}
        >
          Tarefas
        </Text>
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
            variant="primary"
          />
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={altoContraste ? "#FFD700" : colors.textMuted}
          />
          <TextInput
            placeholder="Buscar tarefas..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />
        </View>

        {/* Sort */}
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: colors.text }]}>
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
            showEditButton={true}
            onDeleteSuccess={onRefresh}
          />
        ) : (
          <View
            style={[
              styles.historyContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            {concluidasFiltradas.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Nenhuma tarefa concluída 🎉
              </Text>
            ) : (
              <FlatList
                scrollEnabled={false}
                data={concluidasFiltradas}
                renderItem={({ item }) => <HistoryItem task={item} />}
                keyExtractor={(item) => item.id}
              />
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
    borderRadius: 12,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 14,
  },
});
