import db from "../models/db";
import { Task } from "../models/taskModel";

export class TaskRepository {
    // Create a new task
    async create(taskData: Partial<Task>): Promise<Task> {
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(
                `INSERT INTO Tasks (title, description, dueDate, user_id) VALUES (?, ?, ?, ?)`,
                [taskData.title, taskData.description, taskData.dueDate, taskData.userId]
            );
            return { id: (result as any).insertId, ...taskData } as Task; // Return the created task with its ID
        } finally {
            connection.release(); // Always release the connection back to the pool
        }
    }

    async getAllTasks(userId: number): Promise<Task[]> {
        const connection = await db.getConnection();
        try {
            console.log(userId)
            // Query to join usertasks with tasks table to get task details
            const [rows] = await connection.execute(`
                SELECT 
                    t.task_id, 
                    t.title, 
                    t.description, 
                    t.created_at, 
                    ut.assigned_at 
                FROM 
                    usertasks ut
                JOIN 
                    tasks t ON ut.task_id = t.task_id 
                WHERE 
                    ut.user_id = ?`, [userId]);
            
            // Check if rows is an array and return it as Task[]
            return Array.isArray(rows) ? (rows as Task[]) : [];
        } catch (error) {
            console.error('Error retrieving tasks:', error);
            return []; // Return an empty array on error
        } finally {
            connection.release(); // Always release the connection back to the pool
        }
    }

    // Find a task by ID
    async findById(taskId: number): Promise<Task | null> {
        return null;
    }

    // Update a task
    async update(taskId: number, taskData: Partial<Task>): Promise<Task | null> {
        const connection = await db.getConnection();
        try {
            await connection.query(
                `UPDATE Tasks SET title = ?, description = ?, dueDate = ? WHERE id = ?`,
                [taskData.title, taskData.description, taskData.dueDate, taskId]
            );
            return this.findById(taskId); // Return the updated task
        } finally {
            connection.release();
        }
    }

    // Delete a task
    async delete(taskId: number): Promise<void> {
        const connection = await db.getConnection();
        try {
            await connection.query(`DELETE FROM Tasks WHERE id = ?`, [taskId]);
        } finally {
            connection.release();
        }
    }
}