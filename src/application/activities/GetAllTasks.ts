// src/domain/usecases/GetAllTasks.ts
import Task from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class GetAllTasks {
  constructor(private repository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.repository.getAll();
  }
}
