import Task from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class CreateTask {
  constructor(private repository: TaskRepository) {}

  async execute(task: Task): Promise<Task> {
    if (!task.title) {
      throw new Error("O título da tarefa não pode ficar vazio.");
    }

    return this.repository.create(task);
  }
}
