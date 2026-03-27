export interface TaskStep {
  id: string
  label: string
  done: boolean
}

export interface Task {
  id: string
  userId: string
  title: string
  description?: string
  steps: TaskStep[]
  status: 'pending' | 'in_progress' | 'done'
  dueDate?: Date
  completedAt?: Date
  reminderMessage?: string
  createdAt: Date
}