// src/domain/usecases/GetAllTasks.ts
import Task from "../../domain/entities/Task";
import { ITaskRepository } from "../../domain/repositories/ITaskRepository";

export class GetAllTasks {
  constructor(private repository: ITaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.repository.getAll();
  }
}
