// src/domain/usecases/DeleteTask.ts
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";

export class DeleteTask {
  constructor(private repository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    if (!id || !id.trim()) {
      throw new Error("ID da tarefa é obrigatório para exclusão.");
    }
    await this.repository.delete(id);
  }
}
