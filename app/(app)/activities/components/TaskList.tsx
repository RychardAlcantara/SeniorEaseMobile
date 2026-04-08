import React, { Dispatch, SetStateAction } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useContraste } from "../../../../src/application/contexts/ContrasteContext";
import TaskItem from "./TaskItem";
import Task from "../../../../src/domain/entities/Task";

export default function TaskList({
  tasks,
  setTasks,
  setEditOpen,
  setSelectedTaskId,
  showEditButton,
  onDeleteSuccess,
}: {
  showEditButton?: boolean;
  setEditOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  tasks: Task[];
  onDeleteSuccess?: () => void;
}) {
  const { altoContraste } = useContraste();

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: altoContraste ? "#000" : "#F4F4F5",
          borderColor: altoContraste ? "#FFD700" : "transparent",
          borderWidth: altoContraste ? 2 : 0,
        },
      ]}
    >
      <Text style={[styles.title, { color: altoContraste ? "#FFF" : "#111" }]}>
        Minhas Tarefas
      </Text>

      <View style={styles.list}>
        {sortedTasks.length === 0 ? (
          <Text
            style={{
              color: altoContraste ? "#FFF" : "#666",
            }}
          >
            Nenhuma tarefa pendente 🎉
          </Text>
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
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  list: {
    gap: 8,
  },
});
