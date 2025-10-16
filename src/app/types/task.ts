export interface Task {
    _id: string;
    title: string;
    status: 'todo' | 'inprogress' | 'done';
    order: number;
    assignedTo?: { _id: string; name: string };
  }
  