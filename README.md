# KNNY-utils

# 📚 Assignments API

A simple RESTful API for managing student assignments built with **Express** and **MongoDB**.

---

## 📦 Base URL

For the API
https://knny-utils-api.onrender.com

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
### 📍 GET `/api/assignments/:id`
Description:
Fetch a specific assignment by ID.

Response:

200 OK → Assignment object

404 Not Found

500 Server Error

### 📍 POST `/api/assignments/`
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

### 📍 PATCH `/api/assignments/:id/`
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

### 📍 PATCH `/api/assignments/:id/submit`
Description:
Mark an assignment as submitted.

Response:

200 OK → Updated assignment object

404 Not Found

500 Server Error

### 📍 DELETE `/api/assignments/:id`
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

Knny Utils API
Welcome to Knny Utils API — a simple, powerful backend service for managing Assignments, Lectures, Links, and Snippets. It’s built with Node.js, Express, and MongoDB (Mongoose), hosted live at https://knny-utils-api.onrender.com.

🚀 Quick Start
Base URL: https://knny-utils-api.onrender.com/api

Use any HTTP client (Postman, curl, or your frontend) to interact with the endpoints.

📦 API Endpoints & Routes
Assignments
GET /api/assignments
Get all assignments

POST /api/assignments
Create a new assignment

GET /api/assignments/:id
Get an assignment by ID

PATCH /api/assignments/:id
Update assignment fields

PATCH /api/assignments/:id/submit
Mark assignment as submitted

DELETE /api/assignments/:id
Delete an assignment

Lectures
GET /api/lectures
List all lectures

POST /api/lectures
Add a new lecture

GET /api/lectures/:id
Get lecture details

PATCH /api/lectures/:id
Update lecture info

DELETE /api/lectures/:id
Remove a lecture

Links
GET /api/links
Get all links

GET /api/links/tag/:tag
Filter links by tag (e.g., /tag/tutorial)

POST /api/links
Add a new link

GET /api/links/:id
Get a specific link

PATCH /api/links/:id
Update link info

DELETE /api/links/:id
Delete a link

Snippets
GET /api/snippets
List all code snippets

POST /api/snippets
Create a snippet

GET /api/snippets/:id
Get snippet details

Note: Snippets do not support update or delete routes in this version.

🗂️ Data Models Overview
Assignment
course (String, required) — Course name

instruction (String, required) — Assignment instructions

givenDate (Date, default = now)

dueDate (Date, required)

submitted (Boolean, default = false)

Auto timestamps for creation and updates

Lecture
title (String, required)

description (String, required)

files (Array of Strings, default empty) — URLs or filenames of lecture files

Auto timestamps included

Link
title (String, required)

url (String, required)

tag (String, default: 'Generic')

Snippet
title (String, required, default: "Code Snippet")

language (String, required, default: "Code Language")

code (String, required, default: "Code Content")

tags (String, default: "Random")

description (String, default: "No Description")

⚙️ Server Setup (for local development)
Clone the repo

Create a .env file with your MongoDB connection string as MONGO_URI

Run:

bash
Copy
Edit
npm install
npm start
The server runs on http://localhost:5000

🛠️ Error Handling
All routes use a centralized error handler middleware to respond with meaningful error messages and proper HTTP status codes.

🎯 Why Use This API?
Manage your educational resources easily (assignments, lectures)

Store useful links tagged for quick filtering

Keep your code snippets organized by language and tags

Lightweight, RESTful, and ready for your frontend apps or automation scripts

🔗 Hosted API
Explore or test the live API here:
https://knny-utils-api.onrender.com

