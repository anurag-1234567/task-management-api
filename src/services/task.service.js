const { randomUUID } = require('crypto');
const { readTasks, writeTasks } = require('../utils/fileStorage');

// Create an error with an HTTP status code
function createError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

// Check whether a date is valid
function isValidDate(value) {
    return !Number.isNaN(Date.parse(value));
}

// Validate task fields before saving them
function validateTaskFields(data, isNewTask = false) {
    const allowedFields = [
        'title',
        'description',
        'status',
        'priority',
        'dueDate'
    ];

    // Do not allow fields that are not part of a task
    const unknownFields = Object.keys(data).filter(
        (field) => !allowedFields.includes(field)
    );

    if (unknownFields.length > 0) {
        throw createError(
            `Unknown field(s): ${unknownFields.join(', ')}`,
            400
        );
    }

    if (isNewTask && (typeof data.title !== 'string' || !data.title.trim())) {
        throw createError('Task title is required.', 400);
    }

    if (data.title !== undefined) {
        if (typeof data.title !== 'string' || !data.title.trim()) {
            throw createError('Task title cannot be empty.', 400);
        }
    }

    if (data.description !== undefined && typeof data.description !== 'string') {
        throw createError('Description must be a string.', 400);
    }

    if (data.status !== undefined) {
        const validStatuses = ['pending', 'in-progress', 'completed'];

        if (!validStatuses.includes(data.status)) {
            throw createError(
                'Status must be pending, in-progress, or completed.',
                400
            );
        }
    }

    if (data.priority !== undefined) {
        const validPriorities = ['low', 'medium', 'high'];

        if (!validPriorities.includes(data.priority)) {
            throw createError(
                'Priority must be low, medium, or high.',
                400
            );
        }
    }

    if (data.dueDate !== undefined && data.dueDate !== null && data.dueDate !== '') {
        if (typeof data.dueDate !== 'string' || !isValidDate(data.dueDate)) {
            throw createError('Please provide a valid due date.', 400);
        }
    }
}

// Get all tasks, with optional filters, search, sorting, and pagination
async function getAllTasks(query) {
    let tasks = await readTasks();

    // Filter tasks by status
    if (query.status) {
        tasks = tasks.filter((task) => task.status === query.status);
    }

    // Filter tasks by priority
    if (query.priority) {
        tasks = tasks.filter((task) => task.priority === query.priority);
    }

    // Search task titles without checking uppercase or lowercase
    if (query.search) {
        const searchText = query.search.toLowerCase();

        tasks = tasks.filter((task) =>
            task.title.toLowerCase().includes(searchText)
        );
    }

    // Sort tasks when sortBy is provided
    if (query.sortBy) {
        const allowedSortFields = ['createdAt', 'dueDate', 'priority'];

        if (!allowedSortFields.includes(query.sortBy)) {
            throw createError(
                'sortBy must be createdAt, dueDate, or priority.',
                400
            );
        }

        const order = query.order || 'asc';

        if (!['asc', 'desc'].includes(order)) {
            throw createError('order must be asc or desc.', 400);
        }

        const priorityOrder = {
            low: 1,
            medium: 2,
            high: 3
        };

        tasks.sort((a, b) => {
            let firstValue = a[query.sortBy];
            let secondValue = b[query.sortBy];

            if (query.sortBy === 'priority') {
                firstValue = priorityOrder[firstValue] || 0;
                secondValue = priorityOrder[secondValue] || 0;
            } else {
                // Tasks without a date are always placed at the end
                if (!firstValue && !secondValue) return 0;
                if (!firstValue) return 1;
                if (!secondValue) return -1;

                firstValue = new Date(firstValue).getTime();
                secondValue = new Date(secondValue).getTime();
            }

            return order === 'asc'
                ? firstValue - secondValue
                : secondValue - firstValue;
        });
    }

    // Return a simple array when pagination is not requested
    if (query.page === undefined && query.limit === undefined) {
        return tasks;
    }

    // Read and validate pagination values
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);

    if (!Number.isInteger(page) || page < 1) {
        throw createError('Page must be a positive whole number.', 400);
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        throw createError('Limit must be between 1 and 100.', 400);
    }

    const total = tasks.length;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = tasks.slice(startIndex, startIndex + limit);

    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        tasks: paginatedTasks
    };
}

// Get one task using its ID
async function getTaskById(id) {
    const tasks = await readTasks();
    const task = tasks.find((item) => item.id === id);

    if (!task) {
        throw createError('Task not found.', 404);
    }

    return task;
}

// Create a new task
async function createTask(data) {
    validateTaskFields(data, true);

    const tasks = await readTasks();
    const now = new Date().toISOString();

    const newTask = {
        id: randomUUID(),
        title: data.title.trim(),
        description: data.description || '',
        status: data.status || 'pending',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || null,
        createdAt: now,
        updatedAt: now
    };

    // Add the new task without removing existing tasks
    tasks.push(newTask);
    await writeTasks(tasks);

    return newTask;
}

// Update an existing task
async function updateTask(id, data) {
    if (!data || Object.keys(data).length === 0) {
        throw createError('Please provide at least one field to update.', 400);
    }

    validateTaskFields(data);

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        throw createError('Task not found.', 404);
    }

    const updatedFields = { ...data };

    if (updatedFields.title !== undefined) {
        updatedFields.title = updatedFields.title.trim();
    }

    if (updatedFields.dueDate === '') {
        updatedFields.dueDate = null;
    }

    const updatedTask = {
        ...tasks[taskIndex],
        ...updatedFields,
        updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    await writeTasks(tasks);

    return updatedTask;
}

// Update only the status of a task
async function updateTaskStatus(id, data) {
    if (!data || Object.keys(data).length !== 1 || data.status === undefined) {
        throw createError(
            'Send only the status field in the request body.',
            400
        );
    }

    validateTaskFields(data);

    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        throw createError('Task not found.', 404);
    }

    tasks[taskIndex].status = data.status;
    tasks[taskIndex].updatedAt = new Date().toISOString();

    await writeTasks(tasks);

    return tasks[taskIndex];
}

// Delete a task
async function deleteTask(id) {
    const tasks = await readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
        throw createError('Task not found.', 404);
    }

    const deletedTask = tasks[taskIndex];

    tasks.splice(taskIndex, 1);
    await writeTasks(tasks);

    return deletedTask;
}

// Count tasks by status
async function getTaskStats() {
    const tasks = await readTasks();

    return {
        totalTasks: tasks.length,
        pendingTasks: tasks.filter((task) => task.status === 'pending').length,
        inProgressTasks: tasks.filter((task) => task.status === 'in-progress').length,
        completedTasks: tasks.filter((task) => task.status === 'completed').length
    };
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
