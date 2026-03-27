import { ITaskRepository } from '../../domain/repositories/ITaskRepository'

export class GetTasksUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(userId: string) {
    return this.taskRepo.findAll(userId)
  }
}