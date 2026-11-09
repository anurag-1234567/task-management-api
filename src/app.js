const express = require('express');

const taskRoutes = require('./routes/task.routes');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Read JSON data sent in request bodies
app.use(express.json());

// Log every incoming request
app.use(logger);

// Simple home route
app.get('/', (req, res) => {
    res.json({
        message: 'Task Management API is running'
    });
});

// All task routes start with /api/tasks
app.use('/api/tasks', taskRoutes);

// Handle routes that do not exist
app.use(notFound);

// Handle application errors
app.use(errorHandler);

module.exports = app;
