import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

import {
  formatDatePtBR,
  formatTimePtBR,
} from "../../../../src/application/helpers/formatDatePtBR";
import { useContraste } from "../../../../src/application/contexts/ContrasteContext";
import { useTaskStore } from "../../../../src/store/taskStore";
import { useTheme } from "../../../../src/presentation/theme/ThemeProvider";
import TaskItemProps from "../../../../src/domain/entities/TaskItem";

export default function TaskItem({
  task,
  tasks,
  setOpen,
  setSelectedTaskId,
  setTasks,
  showEditButton = true,
  onDeleteSuccess,
}: TaskItemProps) {
  const { altoContraste } = useContraste();
  const { colors } = useTheme();
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

    // optimistic update
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

  const formattedDateTime = task.expectedToBeDone
    ? `${formatDatePtBR(new Date(task.expectedToBeDone))} • ${formatTimePtBR(new Date(task.expectedToBeDone))}`
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* LEFT */}
        <View style={styles.left}>
          <Text
            style={[
              styles.check,
              { color: altoContraste ? "#FFF" : colors.primary },
            ]}
          >
            ✔
          </Text>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                { color: altoContraste ? "#FFF" : colors.text },
              ]}
            >
              {task.title}
            </Text>

            {task.notes && (
              <Text
                numberOfLines={1}
                style={[styles.notes, { color: colors.textMuted }]}
              >
                {task.notes}
              </Text>
            )}

            {formattedDateTime && (
              <View style={styles.dateRow}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: altoContraste ? "#FFD700" : colors.textMuted,
                    },
                  ]}
                >
                  Para:
                </Text>
                <Text
                  style={[
                    styles.date,
                    { color: altoContraste ? "#FFF" : colors.textMuted },
                  ]}
                >
                  {formattedDateTime}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.buttonOutline,
              {
                borderColor: altoContraste ? "#FFD700" : colors.border,
                opacity: completing ? 0.6 : 1,
              },
            ]}
            onPress={concludeItem}
            disabled={completing}
          >
            <Text
              style={{
                color: altoContraste ? "#FFD700" : colors.text,
              }}
            >
              {completing ? "Concluindo..." : "Concluir"}
            </Text>
          </TouchableOpacity>

          {showEditButton && (
            <TouchableOpacity
              style={[
                styles.buttonFilled,
                {
                  backgroundColor: altoContraste ? "#FFD700" : colors.primary,
                },
              ]}
              onPress={editItem}
            >
              <Text style={{ color: colors.textOnPrimary }}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleDeletePress}>
            <Text style={{ color: colors.error || "red" }}>
              {deleting ? "..." : "Excluir"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: altoContraste ? "#FFD700" : colors.border,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  left: {
    flexDirection: "row",
    flex: 1,
    paddingRight: 8,
  },
  check: {
    fontWeight: "bold",
    marginRight: 8,
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  notes: {
    fontSize: 14,
    color: "#6B7280",
  },
  dateRow: {
    flexDirection: "row",
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  buttonOutline: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  buttonFilled: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  divider: {
    height: 1,
    width: "100%",
  },
});
