export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  category?: string;
  createdAt: string;
  updatedAt: string;
  overdue: boolean;
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum Status {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface TaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Priority;
  status?: Status;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}