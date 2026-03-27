import { ITaskRepository } from '../../domain/repositories/ITaskRepository'

export class GetTaskHistoryUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(userId: string) {
    return this.taskRepo.findHistory(userId)
  }
}