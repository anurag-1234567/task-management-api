const express = require('express');
const taskController = require('../controllers/task.controller');

const router = express.Router();

// Keep the stats route before the route that uses an ID
router.get('/stats', taskController.getTaskStats);

// Task CRUD routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
