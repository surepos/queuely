export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    Completed = "Completed",
    Expired = "Expired",
  }

export interface TaskFormData {
    title: string;
    description: string;
    startDate: Date | null;
    dueDate: Date | null;
    priority: string;
  }
export interface TaskType {
    _id: number;
    title: string;
    description?: string;
    status?: string;
    priority: string;
    startDate: string;
    dueDate: string;
  }

  export type TaskColumnProps = {
    status: string;
    tasks: TaskType[];
    colors: string;
    moveTask: (taskId: number, toStatus: string) => void;
    handleDelete: (taskId: number) => void;
    onPress: (taskId: number, formData: TaskFormData) => void;
  };
  
export type TaskCardProps = {
    task: TaskType;
    handleDelete: (taskId: number) => void;
    onPress: (taskId: number, formData: TaskFormData) => void;
  };