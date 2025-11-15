import express from 'express';
import { createTask, getTask, getAllTasks } from '../controllers/tasks.controller';

const router = express.Router();

// Create a new task
router.post('/', createTask);

// Get a specific task by ID
router.get('/:id', getTask);

// Get all tasks with pagination
router.get('/', getAllTasks);

export default router;

