// src/domain/usecases/DeleteTask.ts
import { TaskRepository } from "../repositories/TaskRepository";

export class DeleteTask {
  constructor(private repository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || !id.trim()) {
      throw new Error("ID da tarefa é obrigatório para exclusão.");
    }
    await this.repository.delete(id);
  }
}
