export interface Notification {
  id: string
  userId: string
  title: string
  body: string
  scheduledAt: Date
  taskId?: string
}