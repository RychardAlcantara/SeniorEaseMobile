import Task from "../entities/Task";

export interface ITaskRepository {
  create(task: Task): Promise<Task>;

  getAll(): Promise<Task[]>;

  getByUserId(userId: string): Promise<Task[]>;

  update(task: Task): Promise<Task>;

  delete(id: string): Promise<void>;
}
