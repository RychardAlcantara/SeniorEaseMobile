import { ITaskRepository } from '../../domain/repositories/ITaskRepository'
import { Task } from '../../domain/entities/Task'

export class UpdateTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(task: Task): Promise<Task> {
    await this.taskRepo.save(task)
    return task
  }
}
