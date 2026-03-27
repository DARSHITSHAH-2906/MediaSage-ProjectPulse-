import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { TaskController } from '../controllers/task.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();
const projectController = new ProjectController();
const taskController = new TaskController();

const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional()
  })
});

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    due_date: z.string()
  })
});

router.use(authenticateJWT);

router.post('/', validateRequest(createProjectSchema), projectController.createProject);
router.get('/', authenticateJWT, projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.delete('/:id', projectController.deleteProject);

router.post('/:project_id/tasks', validateRequest(createTaskSchema), taskController.createTask);
router.get('/:project_id/tasks', taskController.getTasks);

export default router;
