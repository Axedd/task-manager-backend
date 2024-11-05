import { Request, Response } from 'express';
import { Task } from '../models/taskModel';
import { TaskRepository } from '../repositories/TaskRepository';
import { AuthRequest } from '../middleware/authMiddleware';

const taskRepository = new TaskRepository();

// GET endpoint to retrieve tasks
export const getAllTasks = async (req: AuthRequest, res: Response) => {
    const Tasks = await taskRepository.getAllTasks(req.user!.id)
    res.json({ tasks: Tasks })
};
