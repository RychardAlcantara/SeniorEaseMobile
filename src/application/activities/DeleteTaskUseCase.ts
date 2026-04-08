import { ITaskRepository } from '../../domain/repositories/ITaskRepository'

export class DeleteTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(taskId: string): Promise<void> {
    await this.taskRepo.delete(taskId)
  }
}
