import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { Task } from '../../domain/entities/Task'

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(data: Omit<Task, 'id' | 'createdAt' | 'completed' | 'concludedAt'>) {
    const task: Task = {
      ...data,
      id: Date.now().toString(),
      completed: false,
      concludedAt: null,
      createdAt: new Date(),
    }
    await this.taskRepo.save(task)
    return task
  }
}