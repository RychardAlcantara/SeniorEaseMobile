import { Task } from '../entities/Task'

export interface ITaskRepository {
  findAll(userId: string): Promise<Task[]>
  findById(taskId: string): Promise<Task | null>
  save(task: Task): Promise<void>
  delete(taskId: string): Promise<void>
  findHistory(userId: string): Promise<Task[]>
}