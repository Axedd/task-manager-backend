import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/tasks', authMiddleware, getAllTasks);
router.post('/task/create', authMiddleware, createTask)

export default router;