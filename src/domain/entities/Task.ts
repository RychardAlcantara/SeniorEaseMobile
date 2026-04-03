export interface Task {
  id: string
  userId: string
  title: string
  notes?: string | null
  expectedToBeDone?: string | null
  completed: boolean
  createdAt: Date
  concludedAt?: Date | null
}