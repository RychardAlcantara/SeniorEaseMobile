import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { Task } from '../../domain/entities/Task'

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(data: Omit<Task, 'id' | 'createdAt' | 'status'>) {
    const task: Task = {
      ...data,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    }
    await this.taskRepo.save(task)
    return task
  }
}