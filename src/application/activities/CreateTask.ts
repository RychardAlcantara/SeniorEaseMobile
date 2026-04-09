import Task from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";

export class CreateTask {
  constructor(private repository: ITaskRepository) {}

  async execute(task: Task): Promise<Task> {
    if (!task.title) {
      throw new Error("O título da tarefa não pode ficar vazio.");
    }

    return this.repository.create(task);
  }
}
