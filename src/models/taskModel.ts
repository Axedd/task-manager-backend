export interface Task {
    id: number;
    userId?: number;
    title?: string;
    description: string;
    dueDate?: Date;
    // Any other properties and methods related to the task
}

