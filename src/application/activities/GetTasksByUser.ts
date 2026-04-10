import { ITaskRepository } from "../../domain/repositories/ITaskRepository";

// GetTasksByUser.ts
export class GetTasksByUser {
  constructor(private taskRepository: ITaskRepository) {}

  async execute(userId: string) {
    return this.taskRepository.getByUserId(userId);
  }
}
