const taskService = require('../services/task.service');

// Get all tasks
async function getAllTasks(req, res, next) {
    try {
        const tasks = await taskService.getAllTasks(req.query);

        res.status(200).json({
            success: true,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
}

// Get one task
async function getTaskById(req, res, next) {
    try {
        const task = await taskService.getTaskById(req.params.id);

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
}

// Create a task
async function createTask(req, res, next) {
    try {
        const task = await taskService.createTask(req.body);

        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data: task
        });
    } catch (error) {
        next(error);
    }
}

// Update a task
async function updateTask(req, res, next) {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            data: task
        });
    } catch (error) {
        next(error);
    }
}

// Update only the task status
async function updateTaskStatus(req, res, next) {
    try {
        const task = await taskService.updateTaskStatus(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Task status updated successfully.',
            data: task
        });
    } catch (error) {
        next(error);
    }
}

// Delete a task
async function deleteTask(req, res, next) {
    try {
        const task = await taskService.deleteTask(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully.',
            data: task
        });
    } catch (error) {
        next(error);
    }
}

// Get task statistics
async function getTaskStats(req, res, next) {
    try {
        const stats = await taskService.getTaskStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskStats
};
