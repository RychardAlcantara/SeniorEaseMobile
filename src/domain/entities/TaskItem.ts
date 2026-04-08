import { Dispatch, SetStateAction } from "react";
import Task from "./Task";

export default interface TaskItemProps {
  task: Task;
  tasks: Task[];
  setOpen: (open: boolean) => void;
  setSelectedTaskId: (id: string | null) => void;
  setTasks: Dispatch<SetStateAction<Task[]>>;
  showEditButton?: boolean;
  onDeleteSuccess?: () => void;
}
