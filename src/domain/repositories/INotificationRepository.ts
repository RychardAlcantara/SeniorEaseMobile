import { Notification } from '../entities/Notification'

export interface INotificationRepository {
  schedule(notification: Notification): Promise<void>
  cancel(notificationId: string): Promise<void>
  requestPermission(): Promise<boolean>
}