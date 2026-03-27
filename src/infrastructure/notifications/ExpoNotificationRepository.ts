import { INotificationRepository } from '../../domain/repositories/INotificationRepository'
import { Notification } from '../../domain/entities/Notification'

export class ExpoNotificationRepository implements INotificationRepository {
  async requestPermission() { return false }
  async schedule(_: Notification) {}
  async cancel(_: string) {}
}