import { Router } from "express";
import { getAllTasks } from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get('/tasks', authMiddleware, getAllTasks);

export default router;