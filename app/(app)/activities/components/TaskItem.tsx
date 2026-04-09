import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

import {
  formatDatePtBR,
  formatTimePtBR,
} from "../../../../src/application/helpers/formatDatePtBR";
import { useContraste } from "../../../../src/application/contexts/ContrasteContext";
import { useTaskStore } from "../../../../src/store/taskStore";
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
              { color: altoContraste ? "#FFF" : "#4F46E5" },
            ]}
          >
            ✔
          </Text>

          <View style={styles.textContainer}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: altoContraste ? "#FFF" : "#111" }]}
            >
              {task.title}
            </Text>

            {task.notes && (
              <Text numberOfLines={1} style={styles.notes}>
                {task.notes}
              </Text>
            )}

            {formattedDateTime && (
              <View style={styles.dateRow}>
                <Text
                  style={[
                    styles.label,
                    {
                      color: altoContraste ? "#FFD700" : "#666",
                    },
                  ]}
                >
                  Para:
                </Text>
                <Text
                  style={[
                    styles.date,
                    { color: altoContraste ? "#FFF" : "#666" },
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
                borderColor: altoContraste ? "#FFD700" : "#ccc",
                opacity: completing ? 0.6 : 1,
              },
            ]}
            onPress={concludeItem}
            disabled={completing}
          >
            <Text
              style={{
                color: altoContraste ? "#FFD700" : "#333",
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
                  backgroundColor: altoContraste ? "#FFD700" : "#4F46E5",
                },
              ]}
              onPress={editItem}
            >
              <Text style={{ color: "#FFF" }}>Editar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleDeletePress}>
            <Text style={{ color: "red" }}>{deleting ? "..." : "Excluir"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: altoContraste ? "#FFD700" : "#E5E7EB",
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
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 6,
  },
  buttonOutline: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buttonFilled: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    width: "100%",
  },
});
