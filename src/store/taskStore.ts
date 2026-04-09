import { create } from "zustand";
import { type SetStateAction } from "react";
import Task from "../domain/entities/Task";
import {
  getTasksByUserUseCase,
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
} from "../shared/di/container";

function generateTaskId() {
  const fallback = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return typeof globalThis !== "undefined" &&
    typeof (globalThis as any).crypto?.randomUUID === "function"
    ? (globalThis as any).crypto.randomUUID()
    : fallback;
}

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  loadTasks: (userId: string) => Promise<void>;
  createTask: (
    data: Omit<Task, "id" | "createdAt" | "completed" | "concludedAt">,
  ) => Promise<Task>;
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  setTasks: (tasks: SetStateAction<Task[]>) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  isLoading: false,

  setTasks: (tasks) =>
    set((state) => ({
      tasks:
        typeof tasks === "function"
          ? (tasks as (prev: Task[]) => Task[])(state.tasks)
          : tasks,
    })),

  loadTasks: async (userId) => {
    set({ isLoading: true });
    const tasks = await getTasksByUserUseCase.execute(userId);
    set({ tasks, isLoading: false });
  },

  createTask: async (data) => {
    const task: Task = {
      id: generateTaskId(),
      title: data.title,
      notes: data.notes ?? null,
      expectedToBeDone: data.expectedToBeDone ?? null,
      userId: data.userId,
      completed: false,
      createdAt: new Date(),
      concludedAt: null,
    };

    const created = await createTaskUseCase.execute(task);
    set((s) => ({ tasks: [created, ...s.tasks] }));
    return created;
  },

  updateTask: async (task) => {
    const updated = await updateTaskUseCase.execute(task);
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === task.id ? updated : t)),
    }));
    return updated;
  },

  deleteTask: async (taskId) => {
    await deleteTaskUseCase.execute(taskId);
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }));
  },
}));
