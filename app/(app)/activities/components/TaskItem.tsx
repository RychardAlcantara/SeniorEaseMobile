import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  formatDatePtBR,
  formatTimePtBR,
} from "../../../../src/application/helpers/formatDatePtBR";
import { useTaskStore } from "../../../../src/store/taskStore";
import { useTheme } from "../../../../src/presentation/theme/ThemeProvider";
import { AccessibleButton } from "../../../../src/presentation/components/AccessibleButton";
import TaskItemProps from "../../../../src/domain/entities/TaskItem";

export default function TaskItem({
  task,
  tasks,
  setOpen,
  setSelectedTaskId,
  setTasks,
  showEditButton = true,
  onDeleteSuccess,
  onDeleteRequest,
}: TaskItemProps) {
  const { colors, fontSize, letterSpacing, isHighContrast } = useTheme();
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const completeTask = useTaskStore((state) => state.completeTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  function editItem() {
    setSelectedTaskId(task.id);
    setOpen(true);
  }

  async function concludeItem() {
    if (completing) return;

    setCompleting(true);
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
    } catch (error) {
      setTasks(prevTasks);
      console.error("Erro ao concluir tarefa", error);
    } finally {
      setCompleting(false);
    }
  }

  function handleDeletePress() {
    if (onDeleteRequest) {
      onDeleteRequest(task);
      return;
    }
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir "${task.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: confirmDelete,
        },
      ],
    );
  }

  async function confirmDelete() {
    setDeleting(true);
    const prevTasks = tasks;

    setTasks(prevTasks.filter((t) => t.id !== task.id));

    try {
      await deleteTask(task.id);
      onDeleteSuccess?.();
    } catch (e) {
      setTasks(prevTasks);
    } finally {
      setDeleting(false);
    }
  }

  const dateStr = task.expectedToBeDone
    ? formatDatePtBR(new Date(task.expectedToBeDone))
    : null;
  const timeStr = task.expectedToBeDone
    ? formatTimePtBR(new Date(task.expectedToBeDone))
    : null;

  return (
    <View style={[styles.taskCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
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
            onPress={concludeItem}
            variant="outlined"
            size="small"
            loading={completing}
            disabled={completing}
          />
        </View>
        {showEditButton && (
          <View style={{ flex: 1, marginHorizontal: 2 }}>
            <AccessibleButton
              label="Editar"
              onPress={editItem}
              variant="primary"
              size="small"
            />
          </View>
        )}
        <View style={{ flex: 1, marginLeft: 2 }}>
          <AccessibleButton
            label="Excluir"
            onPress={handleDeletePress}
            variant="outlinedDanger"
            size="small"
            loading={deleting}
            disabled={deleting}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
