import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../../src/presentation/theme/ThemeProvider";
import { useContraste } from "../../../src/application/contexts/ContrasteContext";
import {
  formatDatePtBR,
  formatTimePtBR,
} from "../../../src/application/helpers/formatDatePtBR";
import Task from "../../../src/domain/entities/Task";

interface HistoryItemProps {
  task: Task;
}

export default function HistoryItem({ task }: HistoryItemProps) {
  const { colors } = useTheme();
  const { altoContraste } = useContraste();

  const formattedConcludedAt = task.concludedAt
    ? `${formatDatePtBR(new Date(task.concludedAt))} às ${formatTimePtBR(new Date(task.concludedAt))}`
    : "Data desconhecida";

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Check icon */}
        <Text
          style={[
            styles.checkmark,
            { color: altoContraste ? "#FFD700" : colors.primary },
          ]}
        >
          ✔
        </Text>

        {/* Content */}
        <View style={styles.content}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.text }]}
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

          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            Concluído em {formattedConcludedAt}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          {
            backgroundColor: altoContraste
              ? "#FFD700"
              : colors.border || "#E5E7EB",
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
    paddingVertical: 12,
  },
  checkmark: {
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notes: {
    fontSize: 13,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    width: "100%",
  },
});
