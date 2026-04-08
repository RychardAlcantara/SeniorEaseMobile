// src/domain/usecases/UpdateTask.ts
import Task from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class UpdateTask {
  constructor(private repository: TaskRepository) {}

  async execute(task: Task): Promise<Task> {
    if (!task.id) {
      throw new Error("ID da tarefa é obrigatório para atualização.");
    }
    if (!task.title || !task.title.trim()) {
      throw new Error("O título da tarefa não pode ficar vazio.");
    }
    return this.repository.update(task);
  }
}
