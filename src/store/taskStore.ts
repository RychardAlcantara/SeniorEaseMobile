import { create } from 'zustand'
import { Task } from '../domain/entities/Task'
import {
  getTasksUseCase,
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  completeTaskUseCase,
  getTaskHistoryUseCase,
} from '../shared/di/container'

interface TaskStore {
  tasks: Task[]
  history: Task[]
  isLoading: boolean
  loadTasks: (userId: string) => Promise<void>
  loadHistory: (userId: string) => Promise<void>
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'concludedAt'>) => Promise<Task>
  updateTask: (task: Task) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
  completeTask: (taskId: string, userId: string) => Promise<Task>
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  history: [],
  isLoading: false,

  loadTasks: async (userId) => {
    set({ isLoading: true })
    const tasks = await getTasksUseCase.execute(userId)
    set({ tasks, isLoading: false })
  },

  loadHistory: async (userId) => {
    const history = await getTaskHistoryUseCase.execute(userId)
    set({ history })
  },

  createTask: async (data) => {
    const task = await createTaskUseCase.execute(data)
    set((s) => ({ tasks: [task, ...s.tasks] }))
    return task
  },

  updateTask: async (task) => {
    const updated = await updateTaskUseCase.execute(task)
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === task.id ? updated : t)) }))
    return updated
  },

  deleteTask: async (taskId) => {
    await deleteTaskUseCase.execute(taskId)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== taskId) }))
  },

  completeTask: async (taskId, userId) => {
    const completed = await completeTaskUseCase.execute(taskId, userId)
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== taskId),
      history: [completed, ...s.history],
    }))
    return completed
  },
}))