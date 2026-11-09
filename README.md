# Task Management REST API

A beginner-friendly REST API built with Node.js and Express.js. Tasks are stored in a local JSON file. No database is used.

## 1. Requirements

- Node.js installed
- npm installed
- Postman (for testing the APIs)

## 2. Install and run

Open this project folder in VS Code.

Open the terminal and run:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

Or use:

```bash
npm start
```

The server runs at:

`http://localhost:3000`

## 3. Task fields

| Field | Description |
|---|---|
| id | Automatically generated unique ID |
| title | Required task title |
| description | Task details |
| status | pending, in-progress, or completed |
| priority | low, medium, or high |
| dueDate | Deadline, or null |
| createdAt | Automatically generated creation time |
| updatedAt | Automatically updated modification time |

Default status is `pending`. Default priority is `medium`.

## 4. API endpoints

Base URL: `http://localhost:3000/api/tasks`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Update only status |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/stats` | Get task statistics |

## 5. Sample requests

### Create a task

POST `http://localhost:3000/api/tasks`

Choose Body > raw > JSON in Postman:

```json
{
    "title": "Learn Express",
    "description": "Complete the Express assignment",
    "priority": "high",
    "dueDate": "2026-12-15"
}
```

The API creates the ID and timestamps automatically. The default status is `pending`.

### Get all tasks

GET `http://localhost:3000/api/tasks`

### Filter tasks

GET `http://localhost:3000/api/tasks?status=pending&priority=high`

### Search by title

GET `http://localhost:3000/api/tasks?search=express`

### Get one task

GET `http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE`

### Update a task

PUT `http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE`

```json
{
    "title": "Learn Node and Express",
    "description": "Practice REST API development",
    "priority": "medium"
}
```

### Update only status

PATCH `http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE/status`

```json
{
    "status": "completed"
}
```

This endpoint accepts only the `status` field.

### Delete a task

DELETE `http://localhost:3000/api/tasks/PASTE_TASK_ID_HERE`

## 6. Bonus challenges

### Pagination

GET `http://localhost:3000/api/tasks?page=1&limit=10`

Pagination returns the total count, current page, limit, total pages, and the tasks for that page.

### Task statistics

GET `http://localhost:3000/api/tasks/stats`

Example response:

```json
{
    "success": true,
    "data": {
        "totalTasks": 5,
        "pendingTasks": 2,
        "inProgressTasks": 1,
        "completedTasks": 2
    }
}
```

### Sorting

Sort by creation date:

`GET /api/tasks?sortBy=createdAt&order=desc`

Sort by due date:

`GET /api/tasks?sortBy=dueDate&order=asc`

Sort by priority:

`GET /api/tasks?sortBy=priority&order=desc`

Allowed sort fields: `createdAt`, `dueDate`, and `priority`. Allowed order values: `asc` and `desc`.

Filters, search, sorting, and pagination can be combined.

## 7. Validation and error handling

- Title is required and cannot be empty.
- Priority must be `low`, `medium`, or `high`.
- Status must be `pending`, `in-progress`, or `completed`.
- Due date must be valid when provided.
- Unknown task IDs return 404.
- Unknown routes return 404.
- Invalid request values return 400.
- Unexpected server errors return a general error message.
- An empty JSON file is treated as an empty task list. Invalid JSON is reported as a server-side data-file error.

## 8. Data storage

All tasks are stored in `data/tasks.json`.

The application reads this file when tasks are requested and updates it when tasks are created, changed, or deleted. Data remains after restarting the server.

Do not delete `tasks.json` while the server is running.

## 9. Important

This project uses a local JSON file for learning. It is not designed for multiple server instances or high-traffic production use.
