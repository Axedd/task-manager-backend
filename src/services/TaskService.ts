import { Task } from '../models/taskModel';
import { TaskRepository } from '../repositories/TaskRepository';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(taskData: Partial<Task>): Promise<Task> {
        return this.taskRepository.create(taskData);
    }

    //async getAllUserTasks(userId: number): Promise<Task[]> {
        //return this.taskRepository.getAllTasks(userId);
    //}

    async getTaskById(taskId: number): Promise<Task | null> {
        return this.taskRepository.findById(taskId);
    }

    async updateTask(taskId: number, taskData: Partial<Task>): Promise<Task | null> {
        return this.taskRepository.update(taskId, taskData);
    }

    async deleteTask(taskId: number): Promise<void> {
        return this.taskRepository.delete(taskId);
    }
}