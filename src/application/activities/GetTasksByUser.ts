import { TaskRepository } from "../repositories/TaskRepository";

// GetTasksByUser.ts
export class GetTasksByUser {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string) {
    return this.taskRepository.getByUserId(userId);
  }
}