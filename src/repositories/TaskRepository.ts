import db from "../models/db";
import { Task } from "../models/taskModel";


const formatMySQLDatetime = (date: string | undefined): string => {
    if (!date) {
        // If `assigned_at` is undefined, return the current date/time as fallback
        return new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    const newDate = new Date(date);
    return newDate.toISOString().slice(0, 19).replace('T', ' '); 
};

export class TaskRepository {
    // Create a new task
    async create(taskData: Partial<Task>, user_id: number): Promise<Task> {
        const connection = await db.getConnection();
        try {
            const assignedAtFormatted = formatMySQLDatetime(taskData.assigned_at);

            const [taskResult] = await connection.query(
                `INSERT INTO Tasks (title, description, assigned_at) VALUES (?, ?, ?)`,
                [taskData.title, taskData.description, assignedAtFormatted]
            );

            if (!taskResult) {
                throw new Error('Failed to create task');
            }

            const taskId = (taskResult as any).insertId;

            const [userTaskResult] = await connection.query(
                `INSERT INTO usertasks (task_id, user_id) VALUES (?, ?)`,
                [taskId, user_id]
            );

            if (!userTaskResult) {
                throw new Error('Failed to assign task to user');
            }


            return { id: taskId, user_id, ...taskData } as Task; // Return the created task with its ID
        } catch (err)  {
            console.error('Error creating task:', err);
            
            throw err; // You can handle this with custom error handling if needed
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
                    t.assigned_at
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


}