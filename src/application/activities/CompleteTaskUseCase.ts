import { ITaskRepository } from '../../domain/repositories/ITaskRepository'

export class CompleteTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(taskId: string, userId: string) {
    const task = await this.taskRepo.findById(taskId)
    if (!task || task.userId !== userId) {
      throw new Error('Tarefa não encontrada.')
    }
    const completed = { ...task, completed: true, concludedAt: new Date() }
    await this.taskRepo.save(completed)
    return completed
  }
}