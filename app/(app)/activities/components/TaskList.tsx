import React, { Dispatch, SetStateAction } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../../src/presentation/theme/ThemeProvider";
import TaskItem from "./TaskItem";
import Task from "../../../../src/domain/entities/Task";

export default function TaskList({
  tasks,
  setTasks,
  setEditOpen,
  setSelectedTaskId,
  showEditButton,
  onDeleteSuccess,
  onDeleteRequest,
}: {
  showEditButton?: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  tasks: Task[];
  onDeleteSuccess?: () => void;
  onDeleteRequest?: (task: Task) => void;
}) {
  const { colors, fontSize, letterSpacing, isHighContrast } = useTheme();

  const sortedTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const ta = a.expectedToBeDone
        ? new Date(a.expectedToBeDone).getTime()
        : Infinity;
      const tb = b.expectedToBeDone
        ? new Date(b.expectedToBeDone).getTime()
        : Infinity;

      const aValid = Number.isFinite(ta);
      const bValid = Number.isFinite(tb);

      if (!aValid && !bValid) return 0;
      if (!aValid) return 1;
      if (!bValid) return -1;

      return ta - tb;
    });

  return (
    <View>
      <Text
        style={[styles.sectionTitle, { fontSize: fontSize.label, color: colors.text, letterSpacing }]}
      >
        Minhas Tarefas
      </Text>

      {sortedTasks.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.surface, borderColor: isHighContrast ? colors.border : 'transparent', borderWidth: isHighContrast ? 1 : 0 }]}>
          <Ionicons name="checkmark-done-circle" size={40} color={colors.textMuted} style={{ marginBottom: 8 }} />
          <Text
            style={{
              fontSize: fontSize.body,
              color: colors.textMuted,
              textAlign: 'center',
              letterSpacing,
            }}
          >
            Nenhuma tarefa pendente
          </Text>
        </View>
      ) : (
        sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            tasks={tasks}
            setTasks={setTasks}
            setOpen={setEditOpen}
            setSelectedTaskId={setSelectedTaskId}
            showEditButton={showEditButton}
            onDeleteSuccess={onDeleteSuccess}
            onDeleteRequest={onDeleteRequest}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
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
});
