const fs = require('fs/promises');
const path = require('path');

// Find the location of the tasks.json file
const dataFolder = path.join(__dirname, '../../data');
const filePath = path.join(dataFolder, 'tasks.json');

// Read all tasks from the JSON file
async function readTasks() {
    // Create the data folder if it does not exist
    await fs.mkdir(dataFolder, { recursive: true });

    try {
        const data = await fs.readFile(filePath, 'utf8');

        // An empty file means there are no tasks
        if (!data.trim()) {
            return [];
        }

        const tasks = JSON.parse(data);

        // The JSON file must contain an array
        if (!Array.isArray(tasks)) {
            const error = new Error('Task data file must contain an array.');
            error.statusCode = 500;
            throw error;
        }

        return tasks;
    } catch (error) {
        // Create the JSON file when it does not exist
        if (error.code === 'ENOENT') {
            await writeTasks([]);
            return [];
        }

        // Give a clear error when the JSON is invalid
        if (error instanceof SyntaxError) {
            const fileError = new Error('Task data file contains invalid JSON.');
            fileError.statusCode = 500;
            throw fileError;
        }

        throw error;
    }
}

// Save all tasks into the JSON file
async function writeTasks(tasks) {
    await fs.mkdir(dataFolder, { recursive: true });

    const data = JSON.stringify(tasks, null, 4);

    await fs.writeFile(filePath, data, 'utf8');
}

module.exports = {
    readTasks,
    writeTasks
};
