# KNNY-utils

# 📚 Assignments API

A simple RESTful API for managing student assignments built with **Express** and **MongoDB**.

---

## 📦 Base URL

http://<your-server-url>/api/assignments

---

## 📖 Endpoints

---

### 📍 GET `/api/assignments/`

**Description:**  
Fetch all assignments, sorted by newest first.

**Response:**
- `200 OK` → Array of assignment objects
- `500 Server Error`

Example Response
```json
[
  {
    "_id": "60d...",
    "course": "Node.js",
    "instruction": "Build a REST API",
    "dueDate": "2025-06-30T00:00:00.000Z",
    "submitted": false,
    "createdAt": "2025-06-28T14:30:00.000Z",
    "updatedAt": "2025-06-28T14:30:00.000Z",
    "__v": 0
  }
]

```
📍 GET `/api/assignments/:id`
Description:
Fetch a specific assignment by ID.

Response:

200 OK → Assignment object

404 Not Found

500 Server Error

📍 POST `/api/assignments/`
Description:
Create a new assignment.

Request Body:
```json
{
  "course": "string",
  "instruction": "string",
  "dueDate": "ISO date string"
}

```
Response:

201 Created → New assignment object

400 Bad Request if missing fields

500 Server Error

📍 PATCH `/api/assignments/:id/`
Description:
Update assignment details by ID.

Request Body: (any of the following)

```json

{
  "course": "string",
  "instruction": "string",
  "dueDate": "ISO date string",
  "submitted": true
}
```
Response:

200 OK → Updated assignment object

404 Not Found

500 Server Error

📍 PATCH `/api/assignments/:id/submit`
Description:
Mark an assignment as submitted.

Response:

200 OK → Updated assignment object

404 Not Found

500 Server Error

📍 DELETE `/api/assignments/:id`
Description:
Delete an assignment by ID.

Response:

200 OK → Deletion success message

404 Not Found

500 Server Error

Example Response:

```json

{
  "message": "Assignment deleted successfully"
}
```
📑 Assignment Object Structure
```json

{
  "_id": "string",
  "course": "string",
  "instruction": "string",
  "dueDate": "ISO date string",
  "submitted": true/false,
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string",
  "__v": 0
}

```

🎨 Built With
Node.js

Express

MongoDB

Mongoose

📣 Author
Knny 👨‍💻